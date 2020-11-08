const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const state = {
  db: null,
};

module.exports.connect = async (done) => {
  const uri = process.env.URI;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect((err, data) => {
    if (!err) {
      state.db = data.db("shopping");
      done();
    } else {
      throw err;
    }
  });
};

module.exports.get = () => {
  return state.db;
};
