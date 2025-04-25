const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const dotenv = require("dotenv");
const User = require("../models/users");

dotenv.config({
  path: ".env.test",
});
chai.use(chaiHttp);

const connectTestDB = async () => {
  await mongoose.connect(process.env.TEST_DATABASE_URI);
};

const clearTestDB = async () => {
  await User.deleteMany({});
};

const closeTestDB = async () => {
  await mongoose.connection.close();
};

const generateTestUser = () => ({
  name: "Test User",
  email: "test@example.com",
  password: "123456",
  confirmPassword: "123456",
});

module.exports = {
  chai,
  connectTestDB,
  clearTestDB,
  closeTestDB,
  generateTestUser,
};
