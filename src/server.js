// src/server.js
const express = require('express')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const { router } = require('./routes')
const logger = require('./utils/logger')
const { PORT} = require('./config/env')
const { ValidationError } = require('express-validation')
const schedule = require('node-schedule')

const { cleanupFiles } = require('./filesSharing/files.service')
const {connectDb }=require('./db')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
      description: 'A simple API with Swagger documentation',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes.js'], // Path to your API routes
}

const job = schedule.scheduleJob('0 0 * * *', cleanupFiles);
const swaggerSpec = swaggerJsdoc(swaggerOptions)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err)
  }
  return res.status(500).json(err)
})
app.use(router)
const server = app.listen(PORT, () => {
  connectDb()
  logger.info(`Server is running on http://localhost:${PORT}`)
})

module.exports = {
  server,
  job
}
