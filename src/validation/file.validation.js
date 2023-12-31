const { upload } = require('../filesSharing/files.service')
const { body, validationResult } = require('express-validator')
const fileValidationSchema = [
  upload.single('file'),
  body('file').custom((value, { req }) => {
    if (!req.file) {
      throw new Error('No file uploaded.')
    }
    return true
  }),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
]

exports.fileValidationSchema = fileValidationSchema
