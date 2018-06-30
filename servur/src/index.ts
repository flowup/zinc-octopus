import { Request, Response } from 'express'
import * as express from 'express'
import * as cors from 'cors'
import { createServer } from 'https'
import { readFileSync } from 'fs'

import * as io from 'socket.io'

import { initializeApp, credential } from 'firebase-admin'
import { Lobby } from './lobby';

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

const lobby = new Lobby(sio)

app.options('/', cors())
app.get('/', (req: Request, res: Response) => {
  res.send('Please use websocket connection')
})

httpsApp.listen(process.env.PORT || 8888, () => {
  console.log(`[Server] HTTPS listening on *:${process.env.PORT || 8888}`)
})