const request = require('supertest');
const { server, job } = require('../../src/server');
const fs = require('fs');
const path = require('path');
const { FOLDER } = require('../../src/config/env');

describe('File API - Download', () => {
  let uploadedFilePublicKey;
  let uploadedFilePrivateKey;
  let existingFile;
  const filePath = path.join(__dirname, '../../', FOLDER);

  beforeAll(async () => {
    jest.setTimeout(15000);
    const uploadResponse = await request(server)
      .post('/files')
      .attach('file', Buffer.from('file content'), {
        filename: 'test-file.txt',
        contentType: 'application/json',
      });

    uploadedFilePublicKey = uploadResponse.body.data.publicKey;
    uploadedFilePrivateKey = uploadResponse.body.data.privateKey;

    existingFile = {
      filename: uploadResponse.body.data.filename,
      content: 'file content for testing download',
    };

    // Write the file content to the file system
    fs.writeFileSync(`${filePath}/${existingFile.filename}`, existingFile.content);
  });

  it('should download a file successfully', async () => {
    const response = await request(server).get(`/files/${uploadedFilePublicKey.toString()}`);
    expect(response.header['content-type']).toBe(existingFile.filename.split('.')[0]);
  });

  it('should return a 404 error when downloading a non-existing file', async () => {
    const nonExistingPublicKey = 'non-existing-public-key';
    const response = await request(server).get(`/files/${nonExistingPublicKey}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'file not found');
  });

  afterAll(async () => {
    if (job) {
      job.cancel();
    }
    const serverClosePromise = new Promise((resolve) => {
      server.close(() => {
        resolve();
      });
    });

    await serverClosePromise;
  });
});
