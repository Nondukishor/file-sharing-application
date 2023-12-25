const request = require('supertest')
const express = require('express')
const router = require('../../../src/routes')
const filesController = require('../../../src/filesSharing/files.controller')
const app = express()
app.use(express.json())
app.use('/', router)

jest.mock('../../../src/filesSharing/files.controller')

describe('File Routes', () => {
  test('GET / should return 200 OK', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(200)
  })

  it('POST /files should return 201 for a valid file upload', async () => {
    const response = await request(app)
      .post('/files')
      .attach('file', Buffer.from('file content'), {
        filename: 'test-file.txt',
        contentType: 'application/json',
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty(
      'message',
      'File uploaded successfully',
    )
  }, 100000)

  test('GET /files/{publicKey} should return 200 OK for a valid download', async () => {
    const publicKey = 'mocked-public-key'
    filesController.downloadFile.mockImplementation((req, res) =>
      res.sendStatus(200),
    )

    const response = await request(app).get(`/files/${publicKey}`)
    expect(response.status).toBe(200)
  })

  test('DELETE /files/{privateKey} should return 200 OK for a valid file deletion', async () => {
    const privateKey = 'mocked-private-key'
    filesController.deleteFile.mockImplementation((req, res) =>
      res.sendStatus(200),
    )

    const response = await request(app).delete(`/files/${privateKey}`)
    expect(response.status).toBe(200)
  })
})
