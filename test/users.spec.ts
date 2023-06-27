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
  let _id = "";

  const admin_email = "";
  const admin_password = "";
  const email = faker.internet.email();
  const username = faker.internet.userName();
  const password = faker.internet.password();
  const new_email = faker.internet.email();
  const new_username = faker.internet.userName();
  const new_password = faker.internet.password();

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

        _id = res.body._id;
    })
  })

  describe("Login", () => {
    it('should login successfully', async () => {
      const res = await chai.request(app)
        .post('/auth/login')
        .send({'email': admin_email, 'password': admin_password})

      chai.expect(res.status).to.equal(200);
      chai.expect(res.headers['set-cookie']).to.not.equal(null);

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

  describe("/Patch User", () => {
    it('should Update user details', async () => {
      const res = await chai.request(app)
        .patch('/users/' + _id)
        .send({'email': new_email, 'username': new_username, 'password': new_password});

      chai.expect(res.status).to.equal(200);
      chai.expect(res.body).to.have.property('email', new_email);
      chai.expect(res.body).to.have.property('username', new_username);
    })
  })

  describe("/Delete User", () => {
    it('should Delete a user', async () => {
      const res = await chai.request(app)
        .delete('/users/' + _id)
        .set('Cookie', Cookies);
      
      chai.expect(res.status).to.equal(200);
    })
  })

  describe("Logout", () => {
    it('should logout successfully', async () => {
      const res = await chai.request(app)
        .post('/auth/logout')
        .set('Cookie', Cookies);

      chai.expect(res.status).to.equal(200);
    })
  })
})
