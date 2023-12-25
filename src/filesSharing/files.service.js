const multer = require('multer')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const { FOLDER } = require('../config/env')
const { File } = require('./files.model')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(path.join(__dirname, '../../', FOLDER), { recursive: true })
    cb(null, FOLDER)
  },

  filename: (req, file, cb) => {
    let file_name = ''
    if (file.originalname) {
      file_name = file.originalname.split('.')[0]
    }
    cb(null, `${Date.now()}-${file_name}${path.extname(file.originalname)}`)
  },
})

exports.upload = multer({ storage: storage })

exports.generateKeys = (req, res, next) => {
  const prime_length = 2048
  const diffHell = crypto.createDiffieHellman(prime_length)
  diffHell.generateKeys()
  req.keys = {
    privateKey: diffHell.getPrivateKey('hex'),
    publicKey: diffHell.getPublicKey('hex'),
  }
  next()
}

exports.isValidPublicKey = (publicKey) => {
  if (typeof publicKey === 'string' && /^[0-9a-fA-F]+$/.test(publicKey)) {
    if (publicKey.length === 512) {
      return true
    }
  }
  return false
}

exports.validateRequest = (req) => {
  if (!req.file) {
    throw new Error('No file uploaded')
  }
}

exports.checkFileExistence = async (filename) => {
  const isExist = await File.findOne({ filename })
  if (isExist) {
    throw new Error('File already exists')
  }
}

exports.createNewFile = (filename, privateKey, publicKey) => {
  const file = new File({
    filename,
    privateKey,
    publicKey,
  })
  return file
}

exports.saveFile = async (file) => {
  await file.save()
}

const cleanupInterval = 5 * 1000
exports.cleanupFiles = () => {
  const uploadDir = path.join(__dirname, '../../', FOLDER)

  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err)
      return
    }

    const currentTime = Date.now()

    files.forEach((file) => {
      const filePath = path.join(uploadDir, file)

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error getting file stats:', err)
          return
        }

        const lastModifiedTime = new Date(stats.mtime).getTime()
        const elapsedTime = currentTime - lastModifiedTime

        if (elapsedTime > cleanupInterval) {
          fs.unlinkSync(filePath, (err) => {
            if (err) {
              console.error('Error deleting file:', err)
            } else {
              console.log(`File deleted: ${filePath}`)
            }
          })
        }
      })
    })
  })
}
