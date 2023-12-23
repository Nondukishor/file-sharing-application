const request = require('supertest');
const { uploadFile, downloadFile, deleteFile } = require('../../../src/filesSharing/files.controller');
const { File } = require('../../../src/filesSharing/files.model');
const fs = require('fs');
const path = require('path');

// Mocking dependencies
jest.mock('../../../src/filesSharing/files.model');
jest.mock('fs');

describe('Files Controller', () => {
  describe('uploadFile', () => {
    it('should upload a file successfully', async () => {
      // Mock req, res, next
      const req = {
        file: { filename: 'test-file.txt' },
        keys: { privateKey: 'private-key', publicKey: 'public-key' },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      // Mock File.findOne to return null (file does not exist)
      File.findOne.mockResolvedValueOnce(null);

      // Mock File.prototype.save
      const saveMock = jest.spyOn(File.prototype, 'save');

      // Call the function
      await uploadFile(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'File uploaded successfully',
        data: {
          filename: 'test-file.txt',
          privateKey: 'private-key',
          publicKey: 'public-key',
        },
      });

      // Verify that File.findOne and File.prototype.save were called
      expect(File.findOne).toHaveBeenCalledWith({ filename: 'test-file.txt' });
      expect(saveMock).toHaveBeenCalled();
    });

    // Add more test cases for error scenarios if needed
  });

  describe('downloadFile', () => {
    it('should download a file successfully', async () => {
      // Mock req, res
      const req = { params: { publicKey: 'public-key' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
        end: jest.fn(),
      };

      // Mock File.findOne to return a file
      File.findOne.mockResolvedValueOnce({
        filename: 'test-file.txt',
      });

      // Mock path.join
      const pathJoinMock = jest.spyOn(path, 'join');
      pathJoinMock.mockReturnValueOnce('/mocked/path/to/test-file.txt');

      // Mock fs.createReadStream
      const createReadStreamMock = jest.fn();
      fs.createReadStream = createReadStreamMock.mockReturnValueOnce('fake file stream');

      // Call the function
      await downloadFile(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-disposition',
        'attachment; filename=test-file.txt',
      );
      expect(res.setHeader).toHaveBeenCalledWith('Content-type', ['txt']);
      expect(createReadStreamMock).toHaveBeenCalledWith('/mocked/path/to/test-file.txt');
      expect(res.end).toHaveBeenCalledWith('fake file stream');
    });

    // Add more test cases for error scenarios if needed
  });

  describe('deleteFile', () => {
    it('should delete a file successfully', async () => {
      // Mock req, res
      const req = { params: { privateKey: 'private-key' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      // Mock File.findOne to return a file
      File.findOne.mockResolvedValueOnce({
        filename: 'test-file.txt',
      });

      // Mock File.deleteOne
      const deleteOneMock = jest.spyOn(File, 'deleteOne').mockResolvedValueOnce({
        deletedCount: 1,
      });

      // Mock path.join
      const pathJoinMock = jest.spyOn(path, 'join');
      pathJoinMock.mockReturnValueOnce('/mocked/path/to/test-file.txt');

      // Mock fs.unlinkSync
      const unlinkSyncMock = jest.spyOn(fs, 'unlinkSync');

      // Call the function
      await deleteFile(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'File removed successfully' });
      expect(deleteOneMock).toHaveBeenCalledWith({ privateKey: 'private-key' });
      expect(pathJoinMock).toHaveBeenCalledWith(
        __dirname,
        '../../',
        FOLDER,
        'test-file.txt',
      );
      expect(unlinkSyncMock).toHaveBeenCalledWith('/mocked/path/to/test-file.txt');
    });

    // Add more test cases for error scenarios if needed
  });
});
