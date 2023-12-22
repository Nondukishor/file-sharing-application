// src/server.js
const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const {router} = require("./routes")
const swaggerDocs = require('./utils/swagggers');
const logger = require('./utils/logger');
const {PORT} = require('./config/env')
const { ValidationError } = require('express-validation')
const { rateLimit } = require('express-rate-limit') 
const schedule = require('node-schedule');
const { cleanupFiles } = require('./filesSharing/files.service');
require('./db')
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 15 minutes
	limit: 2, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: 'Daily download/upload limit exceeded',
})


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
  };

// app.use(limiter)
schedule.scheduleJob('*/5 * * * * *', cleanupFiles);
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(function(err, req, res, next) {
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json(err)
    }
    return res.status(500).json(err)
  })
app.use(router)
app.listen(PORT, () => {
logger.info(`Server is running on http://localhost:${PORT}`);
});

module.exports= app
