const mongoose = require('mongoose');

let MongoMemoryServer;

const connectDB = async () => {
  let uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.log(`Failed to connect to ${uri}, falling back to in-memory...`);
    }
  }

  MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
  const mongod = await MongoMemoryServer.create();
  uri = mongod.getUri();
  console.log(`Using in-memory MongoDB at: ${uri}`);

  const conn = await mongoose.connect(uri);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
