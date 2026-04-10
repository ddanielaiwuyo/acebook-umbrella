const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/user.js");
const Comment = require("./models/comment.js");
const Post = require("./models/post.js");
const bcrypt = require("bcrypt");
// const { Post, Comment } = require("./models/new_post_schema.js");

dotenv.config();
const CONNECTION_STRING = process.env.MONGODB_URL;
if (!CONNECTION_STRING) {
  throw new Error(`
	Expected to find connection string for mongoDB but got ${CONNECTION_STRING}
	Did you place it in the .env file?
		`);
}

/**
 * All posts are saved in the 'posts' collection in mongo to use for
 * dev and testing.
 * Test-Users:
 * 	sam@example.com, password1234
 * 	john@example.com, password1234
 * 	nadia@example.com, password1234
 */

async function seedDatabase() {
  const hashedPassword = await bcrypt.hash("password1234", 10);
  await mongoose.connect(CONNECTION_STRING);

  // Clear all documents before reseeding
  await User.deleteMany({});
  await Post.deleteMany({});
  await Comment.deleteMany({});

  // Create users
  const sam = await User.create({
    name: "Sam Lavin",
    email: "sam@example.com",
    password: hashedPassword,
  });
  const john = await User.create({
    name: "John Gjenset",
    email: "john@example.com",
    password: hashedPassword,
  });
  const tom = await User.create({
    name: "Tom Delande",
    email: "tom@example.com",
    password: hashedPassword,
  });
  const paul = await User.create({
    name: "Paul Mcpherson",
    email: "paul@example.com",
    password: hashedPassword,
  });
  const nadia = await User.create({
    name: "Nadia Neuwman",
    email: "nadia@example.com",
    password: hashedPassword,
  });
  const billy = await User.create({
    name: "Billy Campbell",
    email: "billy@example.com",
    password: hashedPassword,
  });

  // // Post 1
  const post1 = await Post.create({
    owner: sam._id,
    title: "First Post on Acebook-Umbrella",
    content: "First Post on Acebook-Umbrella, oh",
    likeCount: 100,
  });

  const p1c1 = await Comment.create({
    post_id: post1._id,
    owner: john._id,
    message: "Hey there, nice to meet you",
  });

  const p1c2 = await Comment.create({
    post_id: post1._id,
    owner: paul._id,
    message: "Can't wait to have you work at the company",
  });
  const p1c3 = await Comment.create({
    post_id: post1._id,
    owner: nadia._id,
    message: "Watch One Piece",
  });
  await Post.findByIdAndUpdate(post1._id, {
    comments: [p1c1._id, p1c2._id, p1c3._id],
  });

  // Post 2
  const post2 = await Post.create({
    owner: john._id,
    title: "Best coffee",
    content: "Just had the best coffee of my life ☕",
    likeCount: 400,
  });
  const p2c1 = await Comment.create({
    post_id: post2._id,
    owner: sam._id,
    message: "Where was this?? I need to know immediately",
  });
  const p2c2 = await Comment.create({
    post_id: post2._id,
    owner: tom._id,
    message: "Coffee snob behaviour, I respect it",
  });
  const p2c3 = await Comment.create({
    post_id: post2._id,
    owner: billy._id,
    message: "Tag the location!!",
  });
  await Post.findByIdAndUpdate(post2._id, {
    comments: [p2c1._id, p2c2._id, p2c3._id],
  });

  // Post 3
  const post3 = await Post.create({
    owner: tom._id,
    title: "First marathon",
    content: "Just finished my first marathon, I can't feel my legs",
    likeCount: 300,
  });
  const p3c1 = await Comment.create({
    post_id: post3._id,
    owner: paul._id,
    message: "Absolute legend, well done mate",
  });
  const p3c2 = await Comment.create({
    post_id: post3._id,
    owner: nadia._id,
    message: "You trained so hard for this, so proud!",
  });
  const p3c3 = await Comment.create({
    post_id: post3._id,
    owner: billy._id,
    message: "Now do an ultramarathon",
  });
  await Post.findByIdAndUpdate(post3._id, {
    comments: [p3c1._id, p3c2._id, p3c3._id],
  });

  // Post 4
  const post4 = await Post.create({
    owner: paul._id,
    title: "Hot take",
    content: "Hot take: pineapple belongs on pizza",
    likeCount: 20,
  });
  const p4c1 = await Comment.create({
    post_id: post4._id,
    owner: sam._id,
    message: "I am blocking you",
  });
  const p4c2 = await Comment.create({
    post_id: post4._id,
    owner: john._id,
    message: "Finally someone brave enough to say it",
  });
  const p4c3 = await Comment.create({
    post_id: post4._id,
    owner: tom._id,
    message: "This is why we can't have nice things",
  });
  await Post.findByIdAndUpdate(post4._id, {
    comments: [p4c1._id, p4c2._id, p4c3._id],
  });

  // Post 5
  const post5 = await Post.create({
    owner: nadia._id,
    title: "Learning guitar",
    content: "Started learning guitar, my neighbours hate me",
    likeCount: 286,
  });
  const p5c1 = await Comment.create({
    post_id: post5._id,
    owner: paul._id,
    message: "Wonderwall is a rite of passage, keep going",
  });
  const p5c2 = await Comment.create({
    post_id: post5._id,
    owner: billy._id,
    message: "What song are you learning first?",
  });
  const p5c3 = await Comment.create({
    post_id: post5._id,
    owner: sam._id,
    message: "Invest in some soundproofing lol",
  });
  await Post.findByIdAndUpdate(post5._id, {
    comments: [p5c1._id, p5c2._id, p5c3._id],
  });

  // Post 6
  const post6 = await Post.create({
    owner: billy._id,
    title: "WFH day 47",
    content:
      "Working from home day 47, I have forgotten what a commute feels like",
    likeCount: 78,
  });
  const p6c1 = await Comment.create({
    post_id: post6._id,
    owner: john._id,
    message: "Living the dream honestly",
  });
  const p6c2 = await Comment.create({
    post_id: post6._id,
    owner: nadia._id,
    message: "I miss the office and I can't believe I'm saying that",
  });
  const p6c3 = await Comment.create({
    post_id: post6._id,
    owner: tom._id,
    message: "My commute is now bed to desk, 4 seconds flat",
  });
  await Post.findByIdAndUpdate(post6._id, {
    comments: [p6c1._id, p6c2._id, p6c3._id],
  });

  await mongoose.connection.close();
}
try {
  seedDatabase().then(
    (success) => {
      console.log("Success in creating dummy posts", success);
    },
    (err) => {
      console.log("Error occured creating dummy posts", err);
    },
  );
} catch (err) {
  console.error(err);
  console.error(err.stack);
}
