const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartcart';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database] Local MongoDB connection failed (${error.message}). Initializing fallback MongoMemoryServer...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`[Database] Fallback MongoMemoryServer connected successfully at: ${uri}`);
    } catch (memErr) {
      console.error(`[Database Error] MongoMemoryServer initialization failed: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
