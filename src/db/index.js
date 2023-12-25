const mongoose = require('mongoose')
const { DATABASE_URL } = require('../config/env')
/**
 * Connects to the MongoDB database using the provided URL.
 *
 * @async
 * @function
 * @returns {Promise<void>} A promise that resolves when the database connection is successful.
 * @throws {Error} If there is an error connecting to the database.
 */
exports.connectDb = async () => {
  try {
    await mongoose.connect(DATABASE_URL)
    console.log('Database Connected')
  } catch (error) {
    console.error(error)
    throw error
  }
}
