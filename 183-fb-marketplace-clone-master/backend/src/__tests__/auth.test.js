const supertest = require('supertest');
const http = require('http');

const db = require('./db');
const app = require('../app');

let server;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  return db.reset();
});

afterAll((done) => {
  server.close(done);
});

const user = {
  email: 'testing@example.com',
  password: '123456',
  confirmPassword: '123456',
  firstName: 'Frank',
  lastName: 'Halt',
};

describe('auth.js: Create a user account', () => {
  test('400 status code: Bad format', async () => {
    await request
      .post('/v0/sign-up')
      .send({
        email: 'testing@example.com',
        firstName: 'Frank',
        lastName: 'Halt',
      })
      .set('Accept', 'application/json')
      .expect(400);
  });
  test('Confirm password must match Bad format', async () => {
    await request
      .post('/v0/sign-up')
      .send({
        email: 'testing@example.com',
        password: '123456',
        confirmPassword: 'does not match',
        firstName: 'Frank',
        lastName: 'Halt',
      })
      .set('Accept', 'application/json')
      .expect(400);
  });
  test('correct data success', async () => {
    await request
      .post('/v0/sign-up')
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .then(async (data) => {
        expect(data).toBeDefined();
        expect(data.body).toBeDefined();
        await request
          .get('/v0/private/user')
          .set('Content-type', 'application/json')
          .set('Authorization', 'Bearer ' + data.body.accessToken)
          .expect(200)
          .then((connectedUser) => {
            const fullName = user.firstName + ' ' + user.lastName;
            expect(connectedUser).toBeDefined();
            expect(connectedUser.body).toBeDefined();
            expect(connectedUser.body.fullName).toBe(fullName);
          });
      });
  });
  test('Access private profile without token', async () => {
    await request
      .get('/v0/private/user')
      .expect(401);
  });
  test('Access private profile without invalid token', async () => {
    await request
      .get('/v0/private/user')
      .set('Authorization', 'Bearer invalidtoken')
      .expect(403);
  });
  test('returns 409 conflicts', async () => {
    await request
      .post('/v0/sign-up')
      .send(user)
      .set('Accept', 'application/json')
      .expect(409);
  });
});
describe('auth.js: Authenticate a user', () => {
  test('401 status code: With unknown user', async () => {
    await request
      .post('/authenticate')
      .send({
        email: 'doesnotexists@example.com',
        password: 'unknown',
      })
      .set('Accept', 'application/json')
      .expect(401);
  });
  test('401 status code: With incorrect password', async () => {
    await request
      .post('/authenticate')
      .send({
        email: user.email,
        password: 'unknown',
      })
      .set('Accept', 'application/json')
      .expect(401);
  });
  test('200 status code: With correct password', async () => {
    await request
      .post('/authenticate')
      .send({
        email: user.email,
        password: user.password,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
  });
});

