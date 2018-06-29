import { Request, Response } from 'express'
import * as express from 'express'
import { Server } from 'http'
import * as io from 'socket.io'

import { Matchmaker } from './matchmaker';
import { Player } from './player';
import { Game } from './game';


const app = express()
const httpApp = new Server(app)
const sio = io(httpApp)

const matchmaker = new Matchmaker()
matchmaker.on('match', (players) => {
  console.log('matched players: ', JSON.stringify(players))

  const game = new Game(players)
  game.start()
})

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to this shit, plz use port 8888 with websocket')
})

sio.on('connection', (socket) => {
  const player = new Player(socket)
  matchmaker.enqueue(player)

  socket.on('disconnect', () => {
    matchmaker.dequeue(player)
    player.onDisconnect()
  })
})

httpApp.listen(8888, function(){
  console.log('listening on *:8888')
})