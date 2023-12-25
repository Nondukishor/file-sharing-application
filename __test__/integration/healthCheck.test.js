const request = require('supertest')
const mongoose = require('mongoose')
const { server, job } = require('../../src/server')

describe('Health Check API', () => {
  it('should return 200 OK on health check', async () => {
    const response = await request(server).get('/')
    expect(response.status).toBe(200)
  })

  afterAll(async () => {
    if (job) {
      job.cancel()
    }
    await mongoose.disconnect()
    await server.close()
  })
})
