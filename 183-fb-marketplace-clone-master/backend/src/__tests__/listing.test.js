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

let listingid;
test('GET All', async () => {
  await request.get('/v0/listings')
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      listingid = data.body[0];
      expect(data.body[0].title).toEqual('PS5');
      expect(data.body[0].price).toEqual('1000');
      expect(data.body[0].image).toEqual('https://i.imgur.com/olvDRsv.png');
      expect(data.body[1].title).toEqual('XBOSX');
      expect(data.body[1].price).toEqual('1000');
      expect(data.body[1].image).toEqual('https://i.imgur.com/psgTc9R.jpeg');
    });
});

test('GET One', async () => {
  await request.get('/v0/listing/' + listingid.id)
    .expect(200)
    .expect('content-type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.id).toBeDefined();
      expect(data.body.id).toEqual(listingid.id);
      expect(data.body.description).toEqual('brand new playstation');
      expect(data.body.price).toEqual(listingid.price);
      expect(data.body.title).toEqual(listingid.title);
      expect(data.body.user).toEqual('d9ec7011-26e7-46f9-8319-bc847d0fedc3');
      expect(data.body.date).toEqual('2020-02-27T00:10:43Z');
      expect(data.body.image).toEqual(listingid.image);
    });
});

test('GET One from same user', async () => {
  await request.get('/v0/listing/' + listingid.id)
    .expect(200)
    .expect('content-type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.id).toBeDefined();
      expect(data.body.id).toEqual(listingid.id);
      expect(data.body.description).toEqual('brand new playstation');
      expect(data.body.price).toEqual(listingid.price);
      expect(data.body.title).toEqual(listingid.title);
      expect(data.body.user).toEqual('d9ec7011-26e7-46f9-8319-bc847d0fedc3');
      expect(data.body.date).toEqual('2020-02-27T00:10:43Z');
      expect(data.body.image).toEqual(listingid.image);
      expect(data.body.replies).toBeDefined();
    });
});

test('GET Invalid id', async () => {
  await request.get('/v0/listing/596844c0-329a-4906-97f8-13a26cbd0e53')
    .expect(404);
});

test('GET keyword', async () => {
  await request.get('/v0/listings?keyword=ps')
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.length).toEqual(1);
      expect(data.body[0].title).toEqual('PS5');
      expect(data.body[0].price).toEqual('1000');
      expect(data.body[0].image).toEqual('https://i.imgur.com/olvDRsv.png');
    });
});

test('GET wrong keyword', async () => {
  await request.get('/v0/listings?keyword=random1414561')
    .expect(404);
});

const listing = {
  title: 'Nintendo Switch',
  price: '200',
  description: 'yoooshi',
  image: 'https://i.imgur.com/lllSTm7.jpeg',
};

let posted;
const connectedUser = {};

test('POST new', async () => {
  await request
    .post('/authenticate')
    .send({
      email: 'john@doe.com',
      password: '1234',
    })
    .set('Accept', 'application/json')
    .then(async (response) => {
      expect(response).toBeDefined();
      expect(response.body).toBeDefined();
      connectedUser.user = response.body.user;
      connectedUser.accessToken = response.body.accessToken;
      await request.post('/v0/listings')
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + connectedUser.accessToken)
        .send(listing)
        .expect(201)
        .then((data) => {
          expect(data).toBeDefined();
          expect(data.body).toBeDefined();
          expect(data.body.id).toBeDefined();
          posted = data.body;
          expect(data.body.title).toEqual(listing.title);
          expect(data.body.price).toEqual(listing.price);
          expect(data.body.image).toEqual(listing.image);
          expect(data.body.user).toEqual(connectedUser.user.id);
          expect(data.body.date).toBeDefined();
          expect(data.body.replies).toBeDefined();
        });
    });
});

test('GET after Post', async () => {
  await request.get('/v0/listing/' + posted.id)
    .expect(200)
    .expect('content-type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.id).toBeDefined();
      expect(data.body.id).toEqual(posted.id);
      expect(data.body.description).toEqual('yoooshi');
      expect(data.body.price).toEqual(posted.price);
      expect(data.body.title).toEqual(posted.title);
      expect(data.body.user).toEqual(posted.user);
      expect(data.body.date).toBeDefined();
      expect(data.body.image).toEqual(posted.image);
    });
});

test('POST invalid listing', async () => {
  listing.new = 'not valid';
  await request.post('/v0/listings')
    .set('Content-type', 'application/json')
    .set('Authorization', 'Bearer ' + connectedUser.accessToken)
    .send(listing)
    .expect(400);
});

test('Unauthorized post', async () => {
  await request.post('/v0/listings')
    .send(listing)
    .expect(401);
});

test('POST reply', async () => {
  await request
    .post('/authenticate')
    .send({
      email: 'smith@doe.com',
      password: '1234',
    })
    .set('Accept', 'application/json')
    .then(async (response) => {
      expect(response).toBeDefined();
      expect(response.body).toBeDefined();
      const obj = {
        reply: 'waaa',
      };
      await request.post('/v0/listing/' + posted.id)
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + response.body.accessToken)
        .send(obj)
        .expect(201);
    });
});

test('POST reply from same User', async () => {
  const obj = {
    user: 'Yoshi',
    reply: 'waaa',
  };
  await request.post('/v0/listing/' + posted.id)
    .set('Content-type', 'application/json')
    .set('Authorization', 'Bearer ' + connectedUser.accessToken)
    .send(obj)
    .expect(409);
});

test('POST reply from missing id', async () => {
  const obj = {
    user: 'waluigi',
    reply: 'waaa',
  };
  await request.post('/v0/listing/596844c0-329a-4906-97f8-13a26cbd0e53')
    .set('Content-type', 'application/json')
    .set('Authorization', 'Bearer ' + connectedUser.accessToken)
    .send(obj)
    .expect(404);
});

const listingV2 = {
  price: '200',
  user: 'Yoshi',
  description: 'yoooshi',
  image: 'https://i.imgur.com/lllSTm7.jpeg',
};

test('POST missing item', async () => {
  await request.post('/v0/listings')
    .set('Content-type', 'application/json')
    .set('Authorization', 'Bearer ' + connectedUser.accessToken)
    .send(listingV2)
    .expect(400);
});
