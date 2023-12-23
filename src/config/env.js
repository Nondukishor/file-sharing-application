const dotenv = require('dotenv')
dotenv.config()
exports.FOLDER = process.env.FOLDER
exports.PORT = process.env.PORT
exports.DATABASE_URL = process.env.DATABASE_URL
exports.CLEANUP_INTERVAL = process.env.CLEANUP_INTERVAL
exports.DAILY_UPLOAD_LIMIT = process.env.DAILY_UPLOAD_LIMIT
exports.DAILY_DOWNLOAD_LIMIT = process.env.DAILY_DOWNLOAD_LIMIT
