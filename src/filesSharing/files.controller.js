const { File } = require('./files.model')
const path = require('path')
const { FOLDER } = require('../config/env')
const fs = require('fs')
const mime = require('mime-types')
const {
  isValidPublicKey,
  checkFileExistence,
  createNewFile,
  saveFile,
  validateRequest,
} = require('./files.service')
const logger = require('../utils/logger')

const STORAGE_PATH = path.join(__dirname, '../../', FOLDER)

/**
 * Uploads a file, associates it with a public/private key pair,
 * and saves it to the server.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.uploadFile = async (req, res) => {
  try {
    // Validate the incoming request.
    validateRequest(req)

    // Extract keys and file information from the request.
    const { privateKey, publicKey } = req.keys
    const fileName = req.file.filename

    // Check if the file with the same name already exists.
    await checkFileExistence(fileName)

    // Create a new File instance and save it to the database.
    const file = createNewFile(fileName, privateKey, publicKey)
    await saveFile(file)

    // Respond with success message and file details.
    return res.status(201).json({
      message: 'File uploaded successfully',
      data: {
        filename: fileName,
        privateKey,
        publicKey,
      },
    })
  } catch (error) {
    // Handle errors and respond with an appropriate message.
    return res.json({
      message: error.message,
    })
  }
}

/**
 * Downloads a file associated with a given public key.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.downloadFile = async (req, res) => {
  try {
    // Validate the public key.
    const key = req.params.publicKey
    if (!isValidPublicKey(key)) {
      return res.status(400).json({ message: 'Invalid publicKey' })
    }

    // Find the file associated with the public key in the database.
    const file = await File.findOne({ publicKey: key })

    // If the file does not exist, respond with a 404 status.
    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }

    // Construct the file path on the server.
    const filePath = path.join(STORAGE_PATH, file.filename)

    // Check if the file exists on the server.
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ message: 'File access error' })
    }

    // Stream the file to the response.
    const fileStream = fs.createReadStream(filePath)
    const contentType = mime.lookup(file.filename)
    res.status(200)
    res.setHeader('Content-type', contentType)
    res.setHeader(
      'Content-disposition',
      'attachment; filename=' + file.filename,
    )
    res.setHeader('Content-type', contentType)
    fileStream.pipe(res)
  } catch (error) {
    // Log the error and respond with a 500 status.
    logger.error('Error during file download:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * Deletes a file associated with a given private key.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.deleteFile = async (req, res) => {
  try {
    // Retrieve the private key from the request parameters.
    const key = req.params.privateKey

    // Find the file associated with the private key in the database.
    const file = await File.findOne({ privateKey: key })

    // If the file does not exist, respond with a 404 status.
    if (!file) {
      return res.status(404).json({
        message: 'File not found',
      })
    }

    // Delete the file record from the database.
    const deleteFile = await File.deleteOne({
      privateKey: key,
    })

    // If the file record is deleted successfully, remove the file from the server.
    if (deleteFile) {
      const filePath = path.join(STORAGE_PATH, file.filename)
      fs.unlinkSync(filePath)
      return res.status(200).json({ message: 'File removed successfully' })
    }
  } catch (error) {
    // If there is an error, log it and respond with a 500 status.
    if (error) {
      logger.error('Error during file deletion:', error)
      return res.status(500).json({
        message: 'Server error',
      })
    }
  }
}
