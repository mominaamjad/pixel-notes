const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const connectDB = async () => {
  try {
    const uri =
      process.env.NODE_ENV === "test"
        ? process.env.TEST_DATABASE_URI
        : process.env.DATABASE_URI;

    const connection = await mongoose.connect(uri, {});

    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
