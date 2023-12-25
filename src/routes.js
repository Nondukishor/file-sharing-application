const {
  uploadFile,
  downloadFile,
  deleteFile,
} = require('./filesSharing/files.controller')
const { generateKeys } = require('./filesSharing/files.service')
const { fileValidationSchema } = require('./validation/file.validation')
const {
  downloadLimiter,
  uploadLimiter,
} = require('./middlware/limit.middleware')

const { Router } = require('express')
const router = Router()
// Routes
/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns a 200 OK response.
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', (req, res) => res.sendStatus(200))
/**
 * @swagger
 * /files:
 *   post:
 *     summary: Upload a file
 *     description: Upload a file with validation and key generation.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post(
  '/files',
  uploadLimiter,
  fileValidationSchema,
  generateKeys,
  uploadFile,
)
/**
 * @swagger
 * /files/{publicKey}:
 *   get:
 *     summary: Download a file
 *     description: Download a file using the public key.
 *     parameters:
 *       - in: path
 *         name: publicKey
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal server error
 */
router.get('/files/:publicKey', downloadLimiter, downloadFile)

/**
 * @swagger
 * /files/{privateKey}:
 *   delete:
 *     summary: Delete a file
 *     description: Delete a file using the private key.
 *     parameters:
 *       - in: path
 *         name: privateKey
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal server error
 */
router.delete('/files/:privateKey', deleteFile)

module.exports = router
