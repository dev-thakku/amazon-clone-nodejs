const MongoClient = require("mongodb").MongoClient;


const state = {
  db: null,
};

module.exports.connect = async (done) => {
  const uri =
    "mongodb+srv://shopping:crossroads@cluster0.lh4qj.mongodb.net/shopping?retryWrites=true&w=majority";
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