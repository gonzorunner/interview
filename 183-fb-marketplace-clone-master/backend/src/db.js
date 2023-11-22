const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.findUserByEmail = async (email) => {
  const select =
   `SELECT user_account,
  id FROM user_account WHERE user_account->>'email' = $1`;
  const query = {
    text: select,
    values: [email],
  };
  const {rows} = await pool.query(query);
  return rows.length == 1 ? {id: rows[0].id, ...rows[0].user_account} : null;
};

exports.findUserById = async (id) => {
  const select = `SELECT user_account,
  id FROM user_account WHERE id = $1`;
  const query = {
    text: select,
    values: [id],
  };
  const {rows} = await pool.query(query);
  return {id: rows[0].id, ...rows[0].user_account};
};

exports.createUserAccount = async (userAccount) => {
  const user = JSON.stringify({
    first_name: userAccount.firstName,
    last_name: userAccount.lastName,
    email: userAccount.email,
    password: userAccount.hash,
  });
  // https://www.postgresql.org/docs/8.4/sql-insert.html
  const insert =
  'INSERT INTO user_account(user_account) VALUES ($1) RETURNING id';
  const query = {
    text: insert,
    values: [user],
  };
  const result = await pool.query(query);
  const {id} = result.rows[0];
  const createUserAccount = await this.findUserById(id);
  return createUserAccount;
};


exports.selectListings = async (keyword) => {
  let select = 'SELECT * FROM listing';
  let query;
  if (keyword != null) {
    let foo = ' WHERE listing->>\'title\' ~* $1';
    foo += 'OR listing->>\'description\' ~* $1';
    select += foo;
    query = {
      text: select,
      values: [keyword],
    };
  } else {
    query = {
      text: select,
    };
  }
  const {rows} = await pool.query(query);
  const listings = [];
  for (const row of rows) {
    obj = {
      id: row.id,
      title: row.listing.title,
      price: row.listing.price,
      image: row.listing.image,
    };
    listings.push(obj);
  }
  return listings;
};

exports.findListingById = async (id) => {
  const select = 'SELECT * FROM listing WHERE id = $1';
  const query = {
    text: select,
    values: [id],
  };
  const {rows} = await pool.query(query);
  return rows.length == 1 ? {id: rows[0].id, ...rows[0].listing} : null;
};

exports.insertListing = async (listing) => {
  const insert = 'INSERT INTO listing(listing) VALUES ($1) RETURNING id';
  const query = {
    text: insert,
    values: [listing],
  };
  const {rows} = await pool.query(query);
  return rows[0];
};

exports.postReply = async (id, obj) => {
  const select = 'SELECT * FROM listing WHERE id = $1';
  const query = {
    text: select,
    values: [id],
  };
  const {rows} = await pool.query(query);
  const foo = rows[0].listing;
  foo.replies.push(obj);
  const update = 'UPDATE listing SET listing = $1 WHERE id = $2';
  query.text = update;
  query.values = [foo, id];
  await pool.query(query);
  return;
};

exports.selectListingsWithCategory = async (category) => {
  const select = `SELECT * FROM listing WHERE listing->>'category' ` +
  `IN (SELECT id::text FROM category ` +
  `WHERE category->>'category' = $1)`;
  const query = {
    text: select,
    values: [category],
  };
  console.log(query);
  const {rows} = await pool.query(query);
  const listings = [];
  for (const row of rows) {
    obj = {
      id: row.id,
      title: row.listing.title,
      price: row.listing.price,
      image: row.listing.image,
    };
    listings.push(obj);
  }
  return listings;
};

// exports.selectSubcategories = async (category) => {
//   const select = `SELECT category->>'category' FROM ` +
// `category WHERE category->>'parent' = $1`;
//   const query = {
//     text: select,
//     values: [category],
//   };
//   const {rows} = await pool.query(query);
//   const categories = [];
//   for (const row of rows) {
//     categories.push(row['?column?']);
//   }
//   return categories;
// };
