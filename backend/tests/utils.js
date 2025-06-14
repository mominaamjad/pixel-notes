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

// for testing login
const signupTestUser = async (agent, user) => {
  return await agent.post("/api/users/signup").send(user);
};

//   for testing all protected routes
const loginTestUser = async (agent, user) => {
  const res = await agent.post("/api/users/login").send({
    email: user.email,
    password: user.password,
  });
  return res.body.token;
};

const createTestNote = async (agent, token, note = {}) => {
  return await agent
    .post("/api/notes")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: note.title || "Test Note",
      content: note.content || "Content",
      tags: note.tags || [],
      color: note.color || null,
      isFavorite: note.isFavorite || false,
      isArchived: note.isArchived || false,
    });
};

module.exports = {
  chai,
  connectTestDB,
  clearTestDB,
  closeTestDB,
  generateTestUser,
  signupTestUser,
  loginTestUser,
  createTestNote,
};
