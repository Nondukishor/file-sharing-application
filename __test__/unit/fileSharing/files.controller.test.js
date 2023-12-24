const { uploadFile, downloadFile, deleteFile } = require('../../../src/filesSharing/files.controller');
const { File } = require('../../../src/filesSharing/files.model');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv')
dotenv.config()
const {FOLDER} = require("../../../src/config/env")
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
      jest.mock('../../../src/config/env', () => ({
        ...jest.requireActual('../../../src/config/env'),
        FOLDER: 'uploads', // Replace this with your desired mocked folder path
      }));
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
      pathJoinMock.mockReturnValueOnce('uploads/test-file.txt');
  
      // Mock fs.createReadStream
      const createReadStreamMock = jest.spyOn(fs, 'createReadStream');
      createReadStreamMock.mockReturnValueOnce({
        pipe: jest.fn(),
      });
  
      // Call the function
      await downloadFile(req, res);
  
      // Assertions
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.setHeader).toHaveBeenCalledWith("Content-disposition", "attachment; filename=test-file.txt");
      expect(res.setHeader).toHaveBeenCalledWith("Content-type", "test-file");
      expect(createReadStreamMock).toHaveBeenCalledWith('/test-file.txt');
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(res.end).toHaveBeenCalled();
    });
  
    it('should return a 404 error when downloading a non-existing file', async () => {
      // Mock req, res
      const req = { params: { publicKey: 'non-existing-public-key' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mock File.findOne to return null (file does not exist)
      File.findOne.mockResolvedValueOnce(null);
  
      // Call the function
      await downloadFile(req, res);
  
      // Assertions
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'file not found' });
    });
  
    it('should handle server error', async () => {
      // Mock req, res
      const req = { params: { publicKey: 'public-key' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Mock File.findOne to throw an error
      File.findOne.mockRejectedValueOnce(new Error('Some error'));
  
      // Call the function
      await downloadFile(req, res);
  
      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
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
  });
});
