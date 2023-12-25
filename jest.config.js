require('dotenv').config()
module.exports = {
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
}
