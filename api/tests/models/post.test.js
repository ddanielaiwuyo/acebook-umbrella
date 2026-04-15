const mongoose = require("mongoose");
const Post = require("../../models/post");
const User = require("../../models/user");
const seedDatabase = require("../../seed");

describe("Post model", () => {
  beforeAll(async () => {
    await seedDatabase();
    await mongoose.connect("mongodb://0.0.0.0/acebook_test");
  });

  afterAll(async () => {
    await mongoose.connection.close(true);
  });

  it("Saves a post", async () => {
    const activeUser = await User.findOne({ email: "sam@example.com" });
    const userID = activeUser.id;
    const newPost = await Post.create({
      title: "This is a test post",
      content: "Testing the post model, is kinda fun...yeah",
      owner: userID,
    });

    const savedPost = await Post.findOne({ _id: newPost._id });

    expect(newPost.toObject()).toStrictEqual(savedPost.toObject());
  });

  it("A new post has 0 likes and comments", async () => {
    const activeUser = await User.findOne({ email: "sam@example.com" });
    const userID = activeUser.id;
    const newPost = await Post.create({
      title: "Post with 0 likes and comments",
      content: "New post should have 0 likes and 0 comments",
      owner: userID,
    });

    const savedPost = await Post.findOne({ _id: newPost._id });
    const actualLikeCount = savedPost.likeCount;
    const actualComments = savedPost.comments;
    const expectedLikeCount = 0;
    const expectedComments = [];

    expect(actualLikeCount).toEqual(expectedLikeCount);
    expect(actualComments).toEqual(expectedComments);
  });
});
