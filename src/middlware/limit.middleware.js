const { rateLimit } = require('express-rate-limit')
const { DAILY_DOWNLOAD_LIMIT, DAILY_UPLOAD_LIMIT } = require('../config/env')

exports.downloadLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: DAILY_DOWNLOAD_LIMIT, // file download limit
  message: 'Daily download limit exceeded',
})

exports.uploadLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: DAILY_UPLOAD_LIMIT, //File upload limit
  message: 'Daily upload limit exceeded',
})
