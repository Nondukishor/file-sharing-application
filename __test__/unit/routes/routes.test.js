const request = require('supertest');
const express = require('express');
const { router } = require('../../../src/routes');

// Mock the controller functions
jest.mock('../../../src/filesSharing/files.controller', () => ({
  uploadFile: jest.fn(),
  downloadFile: jest.fn(),
  deleteFile: jest.fn(),
}));

jest.mock('../../../src/filesSharing/files.service', () => ({
  generateKeys: jest.fn(),
}));

jest.mock('../../../src/filesSharing/validation/file.validation', () => ({
  fileValidationSchema: jest.fn(),
}));

describe('Files Routes', () => {
  const app = express();
  app.use(express.json());
  app.use(router);

  it('should respond with 200 OK for health check endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  },100000);

  it('should handle file upload', async () => {
    const response = await request(app)
      .post('/files')
      .attach('file', Buffer.from('file content'), {
        filename: 'test-file.txt',
      });

    // Assuming your controller sends a 200 response for successful file upload
    expect(response.status).toBe(200);

    // Add more assertions based on your specific implementation
  },100000);

  it('should handle file download', async () => {
    // Mock File.findOne to simulate the existence of a file
    jest.spyOn(require('../../../src/filesSharing/files.model'), 'File').mockImplementationOnce(() => ({
      findOne: jest.fn().mockResolvedValueOnce({
        filename: 'test-file.txt',
      }),
    }));

    const response = await request(app).get('/files/public-key');

    // Assuming your controller sends a 200 response for successful file download
    expect(response.status).toBe(200);

    // Add more assertions based on your specific implementation
  },100000);

  it('should handle file deletion', async () => {
    // Mock File.findOne to simulate the existence of a file
    jest.spyOn(require('../../../src/filesSharing/files.model'), 'File').mockImplementationOnce(() => ({
      findOne: jest.fn().mockResolvedValueOnce({
        filename: 'test-file.txt',
      }),
    }));

    // Mock File.deleteOne to simulate successful deletion
    jest.spyOn(require('../../../src/filesSharing/files.model').File, 'deleteOne').mockResolvedValueOnce({
      deletedCount: 1,
    });

    const response = await request(app).delete('/files/private-key');

    // Assuming your controller sends a 200 response for successful file deletion
    expect(response.status).toBe(200);

    // Add more assertions based on your specific implementation
  },100000);
});
