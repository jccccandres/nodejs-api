import { describe } from "mocha"; 
import chai from "chai";
import chaiHttp = require('chai-http');

chai.use(chaiHttp)

let app = require('../src/app');
before(async () => {
  const mod = await import('../src/app');
  app = (mod as any).default;
});

describe("Users", () => {
  describe("/Post User", () => {
    it('should create new user', async () => {
      const res = await chai.request(app)
        .post('/users')
        .send({
          'email': 'sample@mail.com',
          'username': 'sample',
          'password': 'password'
        })

        chai.expect(res.status).to.equal(201);
        chai.expect(res.body).to.have.property('email', 'sample@mail.com');
    })
  })
  
  describe("/Get Users", () => {
    it('should Get all users', async () => {
      const res = await chai.request(app)
        .get('/users');

      chai.expect(res.status).to.equal(200);
      chai.expect(res.body).to.be.an('array');
    })
  })
})