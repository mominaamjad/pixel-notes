const app = require("../index");
const {
  chai,
  connectTestDB,
  clearTestDB,
  closeTestDB,
  generateTestUser,
  signupTestUser,
  loginTestUser,
  createTestNote,
} = require("./utils");
const expect = chai.expect;

describe("GET /api/notes", () => {
  before(async () => await connectTestDB());
  beforeEach(async () => await clearTestDB());
  after(async () => await closeTestDB());

  it("should return all notes for the logged-in user", async () => {
    const user = generateTestUser();
    await signupTestUser(chai.request(app), user);

    const token = await loginTestUser(chai.request(app), user);

    await createTestNote(chai.request(app), token);
    await createTestNote(chai.request(app), token);

    const res = await chai
      .request(app)
      .get("/api/notes")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body).to.have.property("length", 2);
    expect(res.body.data.notes).to.be.an("array").with.lengthOf(2);
  });

  it("should filter notes by tag", async () => {
    const user = generateTestUser();
    await signupTestUser(chai.request(app), user);

    const token = await loginTestUser(chai.request(app), user);

    await createTestNote(chai.request(app), token, { tags: ["work"] });
    await createTestNote(chai.request(app), token);

    const res = await chai
      .request(app)
      .get("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .query({ tag: "work" });

    expect(res.status).to.equal(200);
    expect(res.body.length).to.equal(1);
    expect(res.body.data.notes[0].tags).to.include("work");
  });
});
