const {
  FOLDER,
  PORT,
  DATABASE_URL,
  CLEANUP_INTERVAL,
} = require('../../../src/config/env')
describe('Config Module', () => {
  it('should have the correct values for environment variables', () => {
    expect(FOLDER).toBeDefined()
    expect(PORT).toBeDefined()
    expect(DATABASE_URL).toBeDefined()
    expect(CLEANUP_INTERVAL).toBeDefined()
  })
})
