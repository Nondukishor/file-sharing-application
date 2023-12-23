const request = require('supertest');
const {server, job} = require('../../src/server');

describe('File API', () => {
    let uploadedFilePublicKey;
    let uploadedFilePrivateKey;
  
    it('should upload a file successfully', async () => {
      const response = await request(server)
        .post('/files')
        .attach('file', Buffer.from('file content'), {
          filename: 'test-file.txt',
          contentType: 'application/json',
        });
  
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'File uploaded successfully');
      expect(response.body.data).toHaveProperty('filename');
      expect(response.body.data).toHaveProperty('privateKey');
      expect(response.body.data).toHaveProperty('publicKey');
  
      uploadedFilePublicKey = response.body.data.publicKey;
      uploadedFilePrivateKey = response.body.data.privateKey;
    });

    afterAll(async () => {
        if (job) {
          job.cancel();
        }
        await server.close();
      });
  });