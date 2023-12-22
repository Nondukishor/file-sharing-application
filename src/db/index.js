const mongoose = require("mongoose")
const {DATABASE_URL} = require('../config/env')

mongoose.connect(DATABASE_URL)
const db = mongoose.connection

db.on('error', (error)=>{
    console.log(error)
})


db.once('open', ()=>{
    console.log("Database connected")
})

module.exports=db