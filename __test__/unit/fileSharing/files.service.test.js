const fs = require('fs')
const path = require('path')
const multer = require('multer')
const { File } = require('../../../src/filesSharing/files.model')
const {
  generateKeys,
  isValidPublicKey,
  validateRequest,
  checkFileExistence,
  createNewFile,
  saveFile,
} = require('../../../src/filesSharing/files.service')
const { FOLDER } = require('../../../src/config/env')
jest.mock('fs')
jest.mock('../../../src/filesSharing/files.model')

describe('File Upload', () => {
  beforeEach(() => {
    fs.mkdirSync.mockClear()
    fs.readdir.mockClear()
    fs.stat.mockClear()
    fs.unlinkSync.mockClear()
  })

  test('should generate keys', () => {
    const req = {}
    const res = {}
    const next = jest.fn()

    generateKeys(req, res, next)

    expect(req.keys).toHaveProperty('privateKey')
    expect(req.keys).toHaveProperty('publicKey')
    expect(next).toHaveBeenCalled()
  })

  test('should throw error if no file is uploaded', () => {
    const req = {}
    expect(() => validateRequest(req)).toThrow('No file uploaded')
  })

  it('should return true for a valid public key', () => {
    const validPublicKey =
      '0a27581685ffdf796934c6bcfb6e1fb551392c0ea193fb0bf7a8e85ea4762eb7545bc4aa4115c726ca7af91db61132e8c81af631381e537f0d58864ccfba2b732de60ec4c995c902dc9b9e6e04f996699c71dd70b633256694e0d8b12a0c051cc942fe372e8b1bdd3affb9f91dd8de90c7d934f0eacb13ed7525d141f3fe481c6581e7ce9bc6ff906ab1360bb79add9eddd68a0ddffaa37120b192948a809ee2b1b86b75abffeb3a17d31b8337ce9c204fbf7d7448ca75c3f47e951d760b6bb73c8e70e6a68254f4f0a107a95a4f850bd815cbcf6fbe4c52f62d6ca37588b74cf22ebb80bceb5decfd6c9d22737082852100e974c1e4c410b326e85a987adb5c'
    expect(isValidPublicKey(validPublicKey)).toBe(true)
  })

  it('should return false for an invalid public key', () => {
    const invalidPublicKey = 'invalid-key'
    expect(isValidPublicKey(invalidPublicKey)).toBe(false)
  })

  test('should throw error if file exists', async () => {
    const filename = 'existing-file.txt'
    File.findOne.mockResolvedValueOnce({ filename })

    await expect(checkFileExistence(filename)).rejects.toThrow(
      'File already exists',
    )
    expect(File.findOne).toHaveBeenCalledWith({ filename })
  })

  test('should not throw error if file does not exist', async () => {
    const filename = 'non-existing-file.txt'

    File.findOne.mockResolvedValueOnce(null)
    await expect(checkFileExistence(filename)).resolves.not.toThrow()
    expect(File.findOne).toHaveBeenCalledWith({ filename })
  })

  test('should create a new File instance with the provided parameters', () => {
    const filename = 'test-file.txt'
    const privateKey = 'private-key'
    const publicKey = 'public-key'
    const result = createNewFile(filename, privateKey, publicKey)
    expect(File).toHaveBeenCalledWith({
      filename,
      privateKey,
      publicKey,
    })

    expect(result).toBeInstanceOf(File)
  })

  test('should call the save method of the provided file object', async () => {
    const fileMock = {
      save: jest.fn().mockResolvedValueOnce(), // Mocking the save method
    }
    await saveFile(fileMock)
    expect(fileMock.save).toHaveBeenCalled()
  })
})
