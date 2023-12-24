const { File } = require('./files.model')
const path = require('path')
const { FOLDER } = require('../config/env')
const fs = require('fs')

exports.uploadFile = async (req, res, next) => {
  try {
    const { privateKey, publicKey } = req.keys

    if (!req.file) {
      throw new Error('No file uploaded')
    }
    const file_name = req.file.filename
    const isExist = await File.findOne({
      filename: file_name,
    })

    if (isExist) {
      return res.status(409).json({
        message: 'File already exist',
      })
    }

    const file = new File()
    file.filename = file_name
    file.privateKey = privateKey
    file.publicKey = publicKey
    file.save()

    return res.status(201).json({
      message: 'File uploaded successfully',
      data: {
        filename: file_name,
        privateKey,
        publicKey,
      },
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

exports.downloadFile = async (req, res) => {
  try {
    const key = req.params.publicKey
    const file = await File.findOne({ publicKey: key })
    if (!file) {
      return res.status(404).json({
        message: 'file not found',
      })
    }
    const location = path.join(__dirname, '../../', FOLDER, file.filename)
    const fileStream = fs.createReadStream(location)
    res.status(200)
    res.setHeader('Content-disposition','attachment; filename=' + file.filename)
    res.setHeader('Content-type', file.filename.split('.')[0])
    fileStream.pipe(res)

  } catch (error) {
    if (error) {
      console.error(error)
      return res.status(500).json({
        message: 'Server error',
      })
    }
  }
}

exports.deleteFile = async (req, res) => {
  try {
    const key = req.params.privateKey
    const file = await File.findOne({ privateKey: key })
    if (!file) {
      return res.status(404).json({
        message: 'file not found',
      })
    }
    const deleteFile = await File.deleteOne({
      privateKey: key,
    })
    if (deleteFile) {
      const filePath = path.join(__dirname, '../../', FOLDER, file.filename)
      fs.unlinkSync(filePath)
      return res.status(200).json({ message: 'File removed successfully' })
    }
  } catch (error) {
    if (error) {
      console.log(error)
      return res.status(500).json({
        message: 'Server error',
      })
    }
  }
}
