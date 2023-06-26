import { describe } from "mocha"; 
import chai from "chai";
import { faker } from '@faker-js/faker';
import chaiHttp = require('chai-http');

chai.use(chaiHttp)

let app = require('../src/app');
before(async () => {
  const mod = await import('../src/app');
  app = (mod as any).default;
});

describe("Users", () => {
  let Cookies = "";
  let email = faker.internet.email();
  let username = faker.internet.userName();
  let password = faker.internet.password();
  let _id = "";

  describe("/Post User", () => {
    it('should create new user', async () => {
      const res = await chai.request(app)
        .post('/users')
        .send({
          'email': email,
          'username': username,
          'password': password
        })

        chai.expect(res.status).to.equal(201);
        chai.expect(res.body).to.have.property('email', email);
        chai.expect(res.body).to.have.property('username', username);
    })
  })

  describe("Login", () => {
    it('should success if credentials is valid', async () => {
      const res = await chai.request(app)
        .post('/auth/login')
        .send({'email': email, 'password': password})

      chai.expect(res.status).to.equal(200);
      chai.expect(res.headers['set-cookie']).to.not.equal(null);
      
      _id = res.body._id;
      Cookies = res.headers['set-cookie'].pop().split(';')[0];
    })
  })
  
  describe("/Get Users", () => {
    it('should Get all users', async () => {
      const res = await chai.request(app)
        .get('/users')
        .set('Cookie', Cookies);

      chai.expect(res.status).to.equal(200);
      chai.expect(res.body).to.be.an('array');
    })

    it('should Get a user', async () => {
      const res = await chai.request(app)
        .get('/users/' + _id)
        .set('Cookie', Cookies);

      chai.expect(res.status).to.equal(200);
      chai.expect(res.body).to.have.property('email', email);
      chai.expect(res.body).to.have.property('username', username);
    })
  })
})