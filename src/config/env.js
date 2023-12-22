const dotenv = require('dotenv')
dotenv.config()
exports.FOLDER = process.env.FOLDER
exports.PORT = process.env.PORT
exports.ALGO = process.env.KEY_ALGORITHM
exports.DATABASE_URL = process.env.DATABASE_URL