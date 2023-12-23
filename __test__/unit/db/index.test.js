const mongoose = require('mongoose');
const { connectDb } = require('../../../src/db');
const { DATABASE_URL } = require('../../../src/config/env');
jest.mock('mongoose');

describe('Database Connection', () => {
  it('should connect to the database successfully', async () => {
    // Mock the mongoose.connect function to resolve successfully
    mongoose.connect.mockResolvedValueOnce();

    // Call the connectDb function
    await connectDb();

    // Verify that mongoose.connect was called with the correct DATABASE_URL
    expect(mongoose.connect).toHaveBeenCalledWith(DATABASE_URL);

    // Verify that the console.log statement is called
    expect(console.log).toHaveBeenCalledWith('Database Connected');
  });

  it('should handle database connection error', async () => {
    const errorMessage = 'Connection error';

    // Mock the mongoose.connect function to reject with an error
    mongoose.connect.mockRejectedValueOnce(new Error(errorMessage));

    // Call the connectDb function
    await connectDb();

    // Verify that mongoose.connect was called with the correct DATABASE_URL
    expect(mongoose.connect).toHaveBeenCalledWith(DATABASE_URL);

    // Verify that the console.log statement is not called
    expect(console.log).not.toHaveBeenCalled();

    // Verify that the error message is logged to the console
    expect(console.log).toHaveBeenCalledWith(errorMessage);
  });
});
