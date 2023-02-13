const mongoose = require("mongoose");

const MONGO_URI = String(process.env.MONGO_URI);
const isDevelopment = process.env.NODE_ENV === "development";

const connectMongoDb = async () => {
  try {
    isDevelopment && mongoose.set("debug", true);
    mongoose.set("strictQuery", true);
    const mongo = await mongoose.connect(MONGO_URI);
    console.log(`MongoDb connected on ${mongo.connection.host}`.bgGreen.black);
  } catch (error) {
    console.log(`MongoDb Error: ${error.message}`.bgRed.black);
    process.exit(1);
  }
};

module.exports = {
  connectMongoDb,
};
