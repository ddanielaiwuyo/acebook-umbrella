const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
const Post = require("../../models/post");
const User = require("../../models/user");
const Comment = require("../../models/comment");

require("../mongodb_helper");

const secret = process.env.JWT_SECRET;

function createToken(userId) {
  return JWT.sign(
    {
      sub: userId,
      // Backdate this token of 5 minutes
      iat: Math.floor(Date.now() / 1000) - 5 * 60,
      // Set the JWT token to expire in 10 minutes
      exp: Math.floor(Date.now() / 1000) + 10 * 60,
    },
    secret,
  );
}

let token;
let TEST_USER_ID;
describe("/posts", () => {
  beforeAll(async () => {
    const user = new User({
      firstName: "Post",
      lastName: "Test",
      email: "post-test@test.com",
      password: "password1234",
    });
    let test_user = await user.save();
    TEST_USER_ID = test_user.id;
    await Post.deleteMany({});
    token = createToken(user.id);
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
  });

  describe("POST, when a valid token is present", () => {
    test("responds with a 201", async () => {
      const response = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Testing post endpoint",
          content:
            "Endpoint should save post with token present in the request header",
        });

      expect(response.status).toEqual(201);
    });

    test("creates a new post saved to the database", async () => {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Testing post endpoint saves post to database",
          content:
            "Endpoint should save post with token present in the request header",
        });

      const posts = await Post.find();
      expect(posts.length).toEqual(1);
      expect(posts[0].title).toEqual(
        "Testing post endpoint saves post to database",
      );
    });

    // NOT IMPLEMENTED YET.
    // test("returns a new token after a post", async () => {
    // 	const testApp = request(app);
    // 	const response = await testApp
    // 		.post("/posts")
    // 		.set("Authorization", `Bearer ${token}`)
    // 		.send({
    // 			title: "Testing post endpoint",
    // 			content: "Endpoint should return a new token after each post request"
    // 		});
    //
    // 	const newToken = response.body.token;
    // 	console.log("Reponse body -> ", newToken, response.body)
    // 	const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
    // 	const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);
    // 	console.log("new-token -> ", newTokenDecoded)
    //
    // 	// iat stands for issued at
    // 	expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
    // });
  });

  describe("POST, when token is missing", () => {
    test("responds with a 401", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });

      expect(response.status).toEqual(401);
    });

    // The server will ignore invalid data sent, so it's fine
    // to leave the request body as is
    test("a post is not created", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });

      const posts = await Post.find();
      expect(posts.length).toEqual(0);
    });

    test("a token is not returned", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });

      expect(response.body.token).toEqual(undefined);
    });
  });

  describe("GET, when token is present", () => {
    test("the response code is 200", async () => {
      const post1 = new Post({
        title: "Testing post endpoint with valid token 1",
        content: "Endpoint should return all posts including post 1",
        owner: TEST_USER_ID,
      });
      const post2 = new Post({
        title: "Testing post endpoint with valid token 2 ",
        content: "Endpoint should return all posts including post 2",
        owner: TEST_USER_ID,
      });

      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      console.log(response.body);
      expect(response.status).toEqual(200);
    });

    test("returns every post in the collection", async () => {
      const post1 = new Post({
        title: "Testing post endpoint with valid token 1",
        content: "Endpoint should return all posts including post 1",
        owner: TEST_USER_ID,
      });
      const post2 = new Post({
        title: "Testing post endpoint with valid token 2 ",
        content: "Endpoint should return all posts including post 2",
        owner: TEST_USER_ID,
      });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      const actualPostsReceived = response.body.posts;

      // Endpoint sorts it mostRecentlyCreated hence the reverse
      expect(actualPostsReceived[0].content).toContain(
        "Endpoint should return all posts including post 2",
      );
      expect(actualPostsReceived[1].content).toContain(
        "Endpoint should return all posts including post 1",
      );
    });

    test("returns a new token", async () => {
      const post1 = new Post({
        title: "Testing post endpoint with valid token 1 returns a new token",
        content: "Endpoint should return all posts including post 1",
        owner: TEST_USER_ID,
      });
      await post1.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      const newToken = response.body.token;
      const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
      const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

      // iat stands for issued at
      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
    });
  });

  describe("GET, when token is missing", () => {
    test("the response code is 401 and contains error message", async () => {
      const response = await request(app).get("/posts");
      expect(response.status).toEqual(401);
      expect(response.body.message).toContain("Could not authenticate request");
    });

    test("returns no posts", async () => {
      const post1 = new Post({
        title: "Test Post 1 with no token",
        content: "Endpoint should not return data to client",
        owner: TEST_USER_ID,
      });
      const post2 = new Post({
        title: "Test Post 2 with no token",
        content: "Endpoint should not return data to client",
        owner: TEST_USER_ID,
      });

      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts");

      expect(response.body.posts).toEqual(undefined);
    });

    test("does not return a new token", async () => {
      const post1 = new Post({
        title: "Test Post 1 with no token",
        content: "Endpoint should not return new token to client",
        owner: TEST_USER_ID,
      });
      const post2 = new Post({
        title: "Test Post 2 with no token",
        content: "Endpoint should not return new token to client",
        owner: TEST_USER_ID,
      });
      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts");

      expect(response.body.token).toEqual(undefined);
    });
  });
});
