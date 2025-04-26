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

describe("POST /api/notes", () => {
  before(async () => await connectTestDB());
  beforeEach(async () => await clearTestDB());
  after(async () => await closeTestDB());

  it("should create a new note for the logged-in user", async () => {
    const user = generateTestUser();
    await signupTestUser(chai.request(app), user);

    const token = await loginTestUser(chai.request(app), user);

    const noteData = {
      title: "Test Note",
      content: "This is a test note.",
      color: "#F5A936",
      tags: ["test", "chai", "mocha"],
    };

    const res = await chai
      .request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send(noteData);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("status", "success");
    expect(res.body.data.note).to.include({
      title: noteData.title,
      content: noteData.content,
      color: noteData.color,
    });
    expect(res.body.data.note.tags).to.deep.equal(noteData.tags);
    expect(res.body.data.note).to.have.property("isFavorite", false);
  });
});

describe("GET /api/notes/:id", () => {
  before(async () => await connectTestDB());
  beforeEach(async () => await clearTestDB());
  after(async () => await closeTestDB());

  it("should return the note with the specified ID for the logged-in user", async () => {
    const user = generateTestUser();
    await signupTestUser(chai.request(app), user);
    const token = await loginTestUser(chai.request(app), user);

    const noteRes = await createTestNote(chai.request(app), token);
    const noteId = noteRes.body.data.note._id;

    const res = await chai
      .request(app)
      .get(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body.data.note).to.have.property("_id", noteId);
  });
});

describe("PATCH /api/notes/:id", () => {
  before(async () => await connectTestDB());
  beforeEach(async () => await clearTestDB());
  after(async () => await closeTestDB());

  it("should update the note with the specified ID for the logged-in user", async () => {
    const user = generateTestUser();
    await signupTestUser(chai.request(app), user);
    const token = await loginTestUser(chai.request(app), user);

    const noteRes = await createTestNote(chai.request(app), token);
    const noteId = noteRes.body.data.note._id;

    const updatedData = {
      title: "Updated Title",
      content: "Updated Content",
      tags: ["updated", "test"],
      color: "#F5A936",
    };

    const res = await chai
      .request(app)
      .patch(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body.data.note.title).to.equal(updatedData.title);
    expect(res.body.data.note.content).to.equal(updatedData.content);
    expect(res.body.data.note.color).to.equal(updatedData.color);
    expect(res.body.data.note.tags).to.deep.equal(updatedData.tags);
  });
});

describe("DELETE /api/notes/:id", () => {
  before(async () => await connectTestDB());
  beforeEach(async () => await clearTestDB());
  after(async () => await closeTestDB());

  it("should delete the note with the specified ID for the logged-in user", async () => {
    const user = generateTestUser();
    await signupTestUser(chai.request(app), user);
    const token = await loginTestUser(chai.request(app), user);

    const noteRes = await createTestNote(chai.request(app), token);
    const noteId = noteRes.body.data.note._id;

    const res = await chai
      .request(app)
      .delete(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(204);
  });
});

describe("GET /api/notes/export", () => {
  before(async () => await connectTestDB());
  beforeEach(async () => await clearTestDB());
  after(async () => await closeTestDB());

  it("should export notes as JSON for the logged-in user", async () => {
    const user = generateTestUser();
    await signupTestUser(chai.request(app), user);
    const token = await loginTestUser(chai.request(app), user);

    await createTestNote(chai.request(app), token);
    await createTestNote(chai.request(app), token);

    const res = await chai
      .request(app)
      .get("/api/notes/export")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.notes).to.be.an("array").with.length.greaterThan(0);
  });

  it("should export notes as CSV format", async () => {
    const user = generateTestUser();
    await signupTestUser(chai.request(app), user);
    const token = await loginTestUser(chai.request(app), user);
    await createTestNote(chai.request(app), token);

    const res = await chai
      .request(app)
      .get("/api/notes/export?format=csv")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.header["content-type"]).to.include("text/csv");
    expect(res.text).to.include('"title","content"');
  });
});
