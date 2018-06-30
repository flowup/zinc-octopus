import { Request, Response } from 'express'
import * as express from 'express'
import * as cors from 'cors'
import { createServer } from 'https'
import { readFileSync } from 'fs'

import * as io from 'socket.io'
import * as uuid from 'uuid/v4'

import { initializeApp, credential } from 'firebase-admin'

import { Matchmaker } from './matchmaker';
import { Player, PlayerEvent } from './player';
import { Game } from './game';

const fbServiceAccount = require('./service_accounts/firebase.json')

// initialize firebase app
initializeApp({
  credential: credential.cert(fbServiceAccount),
})

const credentials = {
  key: readFileSync(__dirname + '/sslcert/server.key', 'utf8'),
  cert: readFileSync(__dirname + '/sslcert/server.crt', 'utf8')
}

const app = express()
app.use(cors({
  origin: 'https://zinc-octopus.firebaseapp.com',
  optionsSuccessStatus: 200,
  credentials: true,
}))

const httpsApp = createServer(credentials, app)

const sio = io(httpsApp)

const matchmaker = new Matchmaker()
matchmaker.on('match', (players) => {
  const game = new Game(players)
  game.start()
})

app.options('/', cors())
app.get('/', (req: Request, res: Response) => {
  res.send('Please use websocket connection')
})

sio.on('connection', (socket) => {
  const player = new Player(socket)
  player.id = uuid()
  // attach the player to the socket
  // TODO: refactor this
  socket['player'] = player

  player.socket.on(PlayerEvent.Join, (msg) => {
    if (!msg.name) {
      return player.socket.emit('status', 'Please provide a name')
    }

    player.name = msg.name
    return matchmaker.enqueue(player)
  })
})

httpsApp.listen(process.env.PORT || 8888, () => {
  console.log(`[Server] HTTPS listening on *:${process.env.PORT || 8888}`)
})