const request = require('supertest')
const { server, job } = require('../../src/server')
const mongoose = require('mongoose')

describe('File API download', () => {
  let uploadedFilePublicKey
  let uploadedFilePrivateKey

  it('should upload a file successfully', async () => {
    const response = await request(server)
      .post('/files')
      .attach('file', Buffer.from('file content'), {
        filename: 'test-file.txt',
        contentType: 'application/json',
      })

    uploadedFilePublicKey = response.body.data.publicKey
    uploadedFilePrivateKey = response.body.data.privateKey
    uploadedFileName = response.body.data.filename
    const deleteResponse = await request(server).get(
      `/files/${uploadedFilePublicKey}`,
    )
    expect(deleteResponse.status).toBe(200)
    console.log(deleteResponse.header['content-type'])
    expect(deleteResponse.header['content-type']).toBe(
      uploadedFileName.split('.')[0],
    )
  }, 100000)

  afterAll(async () => {
    if (job) {
      job.cancel()
    }
    await mongoose.disconnect()
    await server.close()
  })
})
