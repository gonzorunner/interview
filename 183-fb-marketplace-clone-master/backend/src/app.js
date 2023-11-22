const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');

// const dummy = require('./dummy');
const {authenticate, signUp, loggedInUsersOnly} = require('./auth');
const {user} = require('./user');
const listing = require('./listing');
const category = require('./category');
const dummy = require('./dummy');
//
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const apiSpec = path.join(__dirname, '../api/openapi.yaml');

const apidoc = yaml.load(fs.readFileSync(apiSpec, 'utf8'));
app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apidoc));

app.post('/authenticate', authenticate);

app.use(
  OpenApiValidator.middleware({
    apiSpec: apiSpec,
    validateRequests: true,
    validateResponses: true,
  }),
);

// Your routes go here
app.get('/v0/dummy', dummy.get);
app.get('/v0/listings', listing.getAll);
app.get('/v0/listing/:id', listing.getById);
app.post('/v0/listings', loggedInUsersOnly, listing.postListing);
app.post('/v0/listing/:id', loggedInUsersOnly, listing.postReply);
app.get('/v0/category/:category', category.getListingsWithCategory);
// app.get('/v0/subcategory/:category', category.getSubcategories);
app.post('/v0/sign-up', signUp);
// An example for a private route
app.get('/v0/private/user', loggedInUsersOnly, user);

app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;
