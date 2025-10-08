import 'dotenv/config'

import express from "express"
import cors from "cors"

import userController from './controller/userController.js'
import alunoController from './controller/alunoController.js'
import professorController from './controller/professorController.js'

const server = express()
server.use(cors())
server.use(express.json())

server.use('/uploads', express.static('uploads'))
server.use(userController)
server.use(alunoController)
server.use(professorController)

server.listen(process.env.PORT, ()=> console.log(`Api: conectada! \nPorta: ${process.env.PORT} \nNome: EnglishCourse`))