const app = require("../index");
const User = require("../models/users");
const {
  chai,
  connectTestDB,
  clearTestDB,
  closeTestDB,
  generateTestUser,
  signupTestUser,
} = require("./utils");
const expect = chai.expect;

describe("POST /api/users/signup", () => {
  before(async () => await connectTestDB());
  beforeEach(async () => await clearTestDB());
  after(async () => await closeTestDB());

  it("should register a user with valid data", async () => {
    const res = await chai
      .request(app)
      .post("/api/users/signup")
      .send(generateTestUser());

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("status", "success");
    expect(res.body).to.have.nested.property(
      "data.user.email",
      "test@example.com"
    );
  });
});

describe("POST /api/users/login", () => {
  before(async () => await connectTestDB());
  beforeEach(async () => await clearTestDB());
  after(async () => await closeTestDB());

  it("should login a registered user with valid credentials", async () => {
    const user = generateTestUser();
    await signupTestUser(chai.request(app), user);

    const res = await chai
      .request(app)
      .post("/api/users/login")
      .send({ email: user.email, password: user.password });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body).to.have.nested.property("data.user.email", user.email);
    expect(res.body).to.have.property("token");
  });
});
