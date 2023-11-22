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

test('GET Invalid URL', async () => {
  await request.get('/v0/so-not-a-real-end-point-ba-bip-de-doo-da/')
    .expect(404);
});

test('GET listings by Vehicles category', async () => {
  await request.get('/v0/category/Vehicles')
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
    });
});

test('GET invalid category', async () => {
  await request.get('/v0/category/asdfsadffsdf')
    .expect(404);
});

// test('GET subcategories of category with none', async () => {
//   await request.get('/v0/subcategory')
//     .expect(404);
// });

// test('GET subcategories of invalid category', async () => {
//   await request.get('/v0/subcategory/asdfsdaf')
//     .expect(404);
// });


// test('GET subcategories of Vehicles', async () => {
//   await request.get('/v0/subcategory/Vehicles')
//     .expect(200)
//     .then((res) => {
//       expect(res).toBeDefined();
//       expect(res.body).toBeDefined();
//       expect(res.body.length).toEqual(2);
//     });
// });


