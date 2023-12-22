const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../src/server'); // Assuming your Express app is in the root directory
const expect = chai.expect;
chai.use(chaiHttp);


describe('Health Check API', () => {
  it('should return 200 OK on health check', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});