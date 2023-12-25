const {
  uploadFile,
  downloadFile,
  deleteFile,
} = require('../../../src/filesSharing/files.controller')
const { File } = require('../../../src/filesSharing/files.model')
const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const mime = require('mime-types')
dotenv.config()
const { FOLDER } = require('../../../src/config/env')

jest.mock('fs')
jest.mock('path')
jest.mock('dotenv')
jest.mock('mime-types')
jest.mock('../../../src/filesSharing/files.model')
describe('Files Controller', () => {
  describe('uploadFile', () => {
    it('should upload a file successfully', async () => {
      const req = {
        file: { filename: 'test-file.txt' },
        keys: { privateKey: 'private-key', publicKey: 'public-key' },
      }
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
      const next = jest.fn()
      File.findOne.mockResolvedValueOnce(null)
      const saveMock = jest.spyOn(File.prototype, 'save')
      await uploadFile(req, res, next)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        message: 'File uploaded successfully',
        data: {
          filename: 'test-file.txt',
          privateKey: 'private-key',
          publicKey: 'public-key',
        },
      })
      expect(File.findOne).toHaveBeenCalledWith({ filename: 'test-file.txt' })
      expect(saveMock).toHaveBeenCalled()
    })
  })

  describe('downloadFile', () => {
    const req = { params: { publicKey: 'valid-public-key' } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
    }

    test('should handle invalid public key', async () => {
      req.params.publicKey = 'invalid-key'
      await downloadFile(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid publicKey' })
    })
  })

  describe('deleteFile', () => {
    const req = { params: { privateKey: 'valid-private-key' } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    test('should handle file not found', async () => {
      File.findOne.mockResolvedValueOnce(null)

      await deleteFile(req, res)

      expect(File.findOne).toHaveBeenCalledWith({
        privateKey: req.params.privateKey,
      })
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'File not found' })
    })

    test('should handle server error during deletion', async () => {
      const mockFile = {
        filename: 'test-file.txt',
      }

      File.findOne.mockResolvedValueOnce(mockFile)
      File.deleteOne.mockRejectedValueOnce(new Error('Some error'))

      await deleteFile(req, res)

      expect(File.findOne).toHaveBeenCalledWith({
        privateKey: req.params.privateKey,
      })
      expect(File.deleteOne).toHaveBeenCalledWith({
        privateKey: req.params.privateKey,
      })
      expect(fs.unlinkSync).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' })
    })
  })
})
