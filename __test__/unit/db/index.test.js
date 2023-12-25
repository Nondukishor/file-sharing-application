const mongoose = require('mongoose')
const { connectDb } = require('../../../src/db')
const { DATABASE_URL } = require('../../../src/config/env')
jest.mock('mongoose')
describe('Database Connection', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should connect to the database successfully', async () => {
    mongoose.connect.mockResolvedValueOnce()
    const consoleSpy = jest.spyOn(console, 'log')
    await connectDb()
    expect(mongoose.connect).toHaveBeenCalledWith(DATABASE_URL)
    expect(consoleSpy).toHaveBeenCalledWith('Database Connected')
  })

  it('should throw an error if there is an issue connecting to the database', async () => {
    const mockError = new Error('Connection error')
    mongoose.connect.mockRejectedValueOnce(mockError)
    await expect(connectDb()).rejects.toThrowError(mockError)
    expect(mongoose.connect).toHaveBeenCalledWith(DATABASE_URL)
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })
})
