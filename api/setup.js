const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Post, Comment } = require("./models/new_post_schema.js");

dotenv.config();
const CONNECTION_STRING = process.env.MONGODB_URL;
if (!CONNECTION_STRING) {
  throw new Error(`
	Expected to find connection string for mongoDB but got ${CONNECTION_STRING}
	Did you place it in the .env file?
		`);
}

/**
 * these posts are ai genereated!
 * All posts are saved in the 'posts' collection in mongo to use for
 * dev and testing.
 */
async function setupDummyPosts() {
  await mongoose.connect(CONNECTION_STRING);
  const post1 = await Post.create({
    owner: "Sam Lavin",
    message: "First Post on Acebook-Umbrella, oh",
    likeCounts: 500,
    comments: [
      await Comment.create({
        username: "John Doe",
        comment: "Hey there, nice to meet you",
      }),

      await Comment.create({
        username: "Jane Doe",
        comment: "Can't wait to have you work at the company",
      }),

      await Comment.create({
        username: "Haley Vine",
        comment: "Watch One Piece",
      }),
    ],
  });

  const post2 = await Post.create({
    owner: "John Gjenset",
    message: "Just had the best coffee of my life ☕",
    likeCounts: 212,
    comments: [
      await Comment.create({
        username: "Sarah Bloom",
        comment: "Where was this?? I need to know immediately",
      }),
      await Comment.create({
        username: "Tom Richards",
        comment: "Coffee snob behaviour, I respect it",
      }),
      await Comment.create({
        username: "Priya Patel",
        comment: "Tag the location!!",
      }),
    ],
  });

  const post3 = await Post.create({
    owner: "Tom Delande",
    message: "Just finished my first marathon, I can't feel my legs",
    likeCounts: 847,
    comments: [
      await Comment.create({
        username: "Mike Lawson",
        comment: "Absolute legend, well done mate",
      }),
      await Comment.create({
        username: "Chloe Evans",
        comment: "You trained so hard for this, so proud!",
      }),
      await Comment.create({
        username: "Derek Stone",
        comment: "Now do an ultramarathon",
      }),
    ],
  });

  const post4 = await Post.create({
    owner: "Paul Mcpherson",
    message: "Hot take: pineapple belongs on pizza",
    likeCounts: 93,
    comments: [
      await Comment.create({
        username: "Luigi Mancini",
        comment: "I am blocking you",
      }),
      await Comment.create({
        username: "Amy Chen",
        comment: "Finally someone brave enough to say it",
      }),
      await Comment.create({
        username: "Rob Dunne",
        comment: "This is why we can't have nice things",
      }),
    ],
  });

  const post5 = await Post.create({
    owner: "Nadia Neuwman",
    message: "Started learning guitar, my neighbours hate me",
    likeCounts: 334,
    comments: [
      await Comment.create({
        username: "Liam Foster",
        comment: "Wonderwall is a rite of passage, keep going",
      }),
      await Comment.create({
        username: "Nina Cross",
        comment: "What song are you learning first?",
      }),
      await Comment.create({
        username: "Jack Harlow",
        comment: "Invest in some soundproofing lol",
      }),
    ],
  });

  const post6 = await Post.create({
    owner: "Billy Campbell",
    message:
      "Working from home day 47, I have forgotten what a commute feels like",
    likeCounts: 561,
    comments: [
      await Comment.create({
        username: "Grace Kim",
        comment: "Living the dream honestly",
      }),
      await Comment.create({
        username: "Ben Archer",
        comment: "I miss the office and I can't believe I'm saying that",
      }),
      await Comment.create({
        username: "Tara Singh",
        comment: "My commute is now bed to desk, 4 seconds flat",
      }),
    ],
  });

  await mongoose.connection.close();
}

try {
  setupDummyPosts().then(
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
