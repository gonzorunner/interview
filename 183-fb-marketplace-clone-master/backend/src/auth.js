const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {findUserByEmail, createUserAccount} = require('./db');
const ACCESS_TOKEN = require('../data/secrets.json');
const saltRounds = 10;

const signIn = (data) => {
  return jwt.sign(
    {...data},
    ACCESS_TOKEN.accessToken,
    {
      expiresIn: '30m',
      algorithm: 'HS256',
    },
  );
};

exports.authenticate = async (req, res) => {
  const {email, password} = req.body;
  const user = await findUserByEmail(email);
  if (user && bcrypt.compareSync(password, user.password)) {
    const userData = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
    };
    const accessToken = signIn(userData);
    res.status(200).json({user: userData, accessToken: accessToken});
  } else {
    res.status(401).send('Username or password incorrect');
  }
};

exports.signUp = async (req, res) => {
  const {firstName, lastName, email, password, confirmPassword} = req.body;
  if (
    !email ||
    !firstName ||
    !lastName ||
    !password ||
    !confirmPassword ||
    password !== confirmPassword
  ) {
    return res.sendStatus(400);
  }

  const user = await findUserByEmail(email);
  if (user) return res.sendStatus(409);

  // https://www.npmjs.com/package/bcrypt
  bcrypt.hash(password, saltRounds, async function(err, hash) {
    const user = await createUserAccount({
      firstName,
      lastName,
      email,
      hash,
    });
    const userData = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
    };
    const accessToken = signIn(userData);
    return res.status(201).json({
      user: userData,
      accessToken,
    });
  });
};

exports.loggedInUsersOnly = (req, res, next) => {
  const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    jwt.verify(token, ACCESS_TOKEN.accessToken, (err, user) => {
      if (err) {
        console.log(err);
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
};
