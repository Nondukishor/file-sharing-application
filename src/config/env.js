const dotenv = require('dotenv')
dotenv.config()
module.exports = {
  FOLDER: process.env.FOLDER,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  CLEANUP_INTERVAL: process.env.CLEANUP_INTERVAL,
  DAILY_UPLOAD_LIMIT: process.env.DAILY_UPLOAD_LIMIT,
  DAILY_DOWNLOAD_LIMIT: process.env.DAILY_DOWNLOAD_LIMIT,
}
