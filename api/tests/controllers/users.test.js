const request = require("supertest");
const app = require("../../app");
const User = require("../../models/user");

require("../mongodb_helper");

describe("/users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST, when email and password are provided", () => {
    test("the response code is 201", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "poppy@email.com", password: "password123" });

      expect(response.statusCode).toBe(201);
    });

    test("a user is created", async () => {
      await request(app)
        .post("/users")
        .send({ email: "scarconstt@email.com", password: "password123" });

      const user = await User.findOne({ email: "scarconstt@email.com" });
      expect(user.email).toEqual("scarconstt@email.com");
    });
  });

  describe("POST, when password is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "skye@email.com" });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain("Invalid credentials");
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ email: "skye@email.com" });

      const users = await User.findOne({ email: "skye@email.com" });
      expect(users).toBe(null);
    });
  });

  describe("POST, when email is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ password: "password123" });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain("must contain email");
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ password: "1234" });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });
});

const DEFAULT_PASSWORD = "password123";

describe("/users Endpoint", () => {
  beforeEach(async () => {
    await User.deleteMany();
  });

  test("POST | Passwords saved from new user is hashed", async () => {
    const payload = {
      email: "personamp3@gmail.com",
      password: DEFAULT_PASSWORD,
    };
    const response = await request(app).post("/users").send(payload);

    expect(response.statusCode).toBe(201);
    const user = await User.findOne({ email: payload.email });
    expect(user.password).not.toContain(payload.password);
  });
});
