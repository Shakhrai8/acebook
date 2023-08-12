const { MongoClient } = require("mongodb");
const uri = "mongodb://127.0.0.1:27017";

if (!uri) {
  throw new Error("Missing MONGO_URI");
}

const client = new MongoClient(uri);
async function connect() {
  await client.connect();
  const db = client.db("acebook_test");
  return db;
}

async function disconnect() {
  await client.close();
}

module.exports = { connect, disconnect };
