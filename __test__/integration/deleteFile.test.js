const request = require('supertest');
const { server, job } = require('../../src/server');

describe('File API - Delete', () => {
  let testFile;

  beforeAll(async () => {
    const uploadResponse = await request(server)
      .post('/files')
      .attach('file', Buffer.from('file content'), {
        filename: 'test-file-to-delete.txt',
        contentType: 'application/json',
      });

    testFile = uploadResponse.body.data;
  });

  it('should delete a file successfully', async () => {
    const response = await request(server).delete(`/files/${testFile.privateKey}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'File removed successfully' });
  });

  it('should return a 404 error when deleting a non-existing file', async () => {
    const nonExistingPrivateKey = 'non-existing-private-key';
    const response = await request(server).delete(`/files/${nonExistingPrivateKey}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'file not found' });
  });

  afterAll(async () => {
    if (job) {
      job.cancel();
    }
    await server.close();
  });
});
