const db = require('./db');

exports.getListingsWithCategory = async (req, res) => {
  const listings = await db.selectListingsWithCategory(req.params.category);
  if (listings.length == 0) {
    res.status(404).send();
  } else {
    res.status(200).json(listings);
  }
};

// exports.getSubcategories = async (req, res) => {
//   const categories = await db.selectSubcategories(req.params.category);
//   if (categories.length == 0) {
//     res.status(404).send();
//   } else {
//     res.status(200).json(categories);
//   }
// };
