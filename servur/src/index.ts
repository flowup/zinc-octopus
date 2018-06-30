import { Request, Response } from 'express'
import * as express from 'express'
import { Server } from 'http'
import { createServer } from 'https'
import { readFileSync } from 'fs'

import * as io from 'socket.io'
import * as uuid from 'uuid/v4'

import { Matchmaker } from './matchmaker';
import { Player, PlayerEvent } from './player';
import { Game } from './game';

const credentials = {
  key: readFileSync(__dirname + '/sslcert/server.key', 'utf8'),
  cert: readFileSync(__dirname + '/sslcert/server.crt', 'utf8')
}

const app = express()
const httpApp = new Server(app)
const httpsApp = createServer(credentials, app)
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
  player.id = uuid()

  player.socket.on(PlayerEvent.Join, (msg) => {
    if (!msg.name) {
      return player.socket.emit('error', 'Please provide a name')
    }

    player.name = msg.name
    return matchmaker.enqueue(player)
  })
})

httpApp.listen(8887, function(){
  console.log('[Server] HTTP listening on *:8887')
})

httpsApp.listen(8888, () => {
  console.log('[Server] HTTPS listening on *:8888')
})