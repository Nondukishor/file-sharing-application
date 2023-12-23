const mongoose = require('mongoose')
const { DATABASE_URL } = require('../config/env')
exports.connectDb= async ()=>{
  try {
    await mongoose.connect(DATABASE_URL)
    console.log('Database Connected');
  } catch (error) {
    console.log(error)
  }
}
