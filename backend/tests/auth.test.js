const app = require("../index");
const {
  chai,
  connectTestDB,
  clearTestDB,
  closeTestDB,
  generateTestUser,
  signupTestUser,
  loginTestUser,
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

describe("POST /api/users/forgotPassword", () => {
  before(async () => await connectTestDB());
  beforeEach(async () => await clearTestDB());
  after(async () => await closeTestDB());

  it("should send a reset password email for valid email", async () => {
    const user = generateTestUser();
    await signupTestUser(chai.request(app), user);

    const res = await chai
      .request(app)
      .post("/api/users/forgotPassword")
      .send({ email: user.email });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message", "Token sent to email!");
  });
});

describe("PATCH /api/users/resetPassword/:token", () => {
  before(async () => await connectTestDB());
  beforeEach(async () => await clearTestDB());
  after(async () => await closeTestDB());

  it("should reset the password when given a valid reset token", async () => {
    const user = generateTestUser();
    await signupTestUser(chai.request(app), user);

    //   get the token
    const forgotPassword = await chai
      .request(app)
      .post("/api/users/forgotPassword")
      .send({ email: user.email });

    const resetToken = forgotPassword.body.resetToken;

    const newPassword = "newpassword123";
    const res = await chai
      .request(app)
      .patch(`/api/users/resetPassword/${resetToken}`)
      .send({
        password: newPassword,
        confirmPassword: newPassword,
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
  });
});

describe("GET /api/users/profile", () => {
  before(async () => await connectTestDB());
  beforeEach(async () => await clearTestDB());
  after(async () => await closeTestDB());

  it("should return user profile when provided a valid token", async () => {
    const user = generateTestUser();
    await signupTestUser(chai.request(app), user);

    const token = await loginTestUser(chai.request(app), user);

    const res = await chai
      .request(app)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body.data.user).to.have.property("email", user.email);
    expect(res.body.data.user).to.not.have.property("password");
  });
});

describe("PATCH /api/users/updatePassword", () => {
  before(async () => await connectTestDB());
  beforeEach(async () => await clearTestDB());
  after(async () => await closeTestDB());

  it("should update the password when provided the correct current password", async () => {
    const user = generateTestUser();
    await signupTestUser(chai.request(app), user);

    const token = await loginTestUser(chai.request(app), user);

    const newPassword = "newpassword123";
    const res = await chai
      .request(app)
      .patch("/api/users/updatePassword")
      .set("Authorization", `Bearer ${token}`)
      .send({
        password: user.password,
        newPassword: newPassword,
        confirmNewPassword: newPassword,
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body).to.have.property("token");
  });
});
