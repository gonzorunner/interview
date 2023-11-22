const db = require('./db');

exports.getAll = async (req, res) => {
  const listings = await db.selectListings(req.query.keyword);
  if (listings.length == 0) {
    res.status(404).send();
  } else {
    res.status(200).json(listings);
  }
};

exports.getById = async (req, res) => {
  const listing = await db.findListingById(req.params.id);
  if (listing != undefined) {
    res.status(200).json(listing);
  } else {
    res.status(404).send();
  }
};

exports.postListing = async (req, res) => {
  if (isValidObject(req.body)) {
    const connectedUser = req.user;
    const obj = {
      title: req.body.title,
      price: req.body.price,
      user: connectedUser.id,
      description: req.body.description,
      image: req.body.image,
      date: new Date(),
      replies: [],
    };
    const id = await db.insertListing(obj);
    obj.id = id.id;
    res.status(201).json({
      ...obj,
      fullName: connectedUser.firstName + ' ' + connectedUser.lastName,
    });
  } else {
    res.status(400).send();
  }
};
exports.postReply = async (req, res) => {
  const {user} = req;
  const obj = {
    user: user.firstName + ' ' + user.lastName,
    reply: req.body.reply,
  };
  const listing = await db.findListingById(req.params.id);
  if (!listing) {
    return res.sendStatus(404);
  } else if (listing.user == user.id) {
    return res.sendStatus(409);
  } else {
    await db.postReply(req.params.id, obj);
    return res.sendStatus(201);
  }
  /*
  const result = await db.postReply(req.params.id, obj);
  return res
  if (result == '201') {
    res.status(201).send();
  } else if (result == '404') {
    res.status(404).send();
  } else {
    res.status(409).send();
  }
  */
};
/**
 *
 * @param {object} obj to be validated
 * @return {boolean} after validation
 */
function isValidObject(obj) {
  // eslint-disable-next-line max-len
  if (
    obj.hasOwnProperty('title') &&
    obj.hasOwnProperty('price') &&
    obj.hasOwnProperty('description') &&
    obj.hasOwnProperty('image')
  ) {
    if (Object.keys(obj).length == 4) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
