const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
const User = require("../../models/user");

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

let token1;
let token2;
let user1;
let user2;
describe("/friends", () => {
  beforeAll(async () => {
    user1 = new User({
      firstName: "FirstName1",
      lastName: "LastName1",
      email: "friend-test1@test.com",
      password: "12345678",
    });

    user2 = new User({
      firstName: "FirstName2",
      lastName: "LastName2",
      email: "friend-test2@test.com",
      password: "12345678",
    });

    await user1.save();
    await user2.save();
    token1 = createToken(user1.id);
    token2 = createToken(user2.id);
  });

  afterEach(async () => {
    await User.deleteMany({});
    user1 = new User({
      firstName: "FirstName1",
      lastName: "LastName1",
      email: "friend-test1@test.com",
      password: "12345678",
    });

    user2 = new User({
      firstName: "FirstName2",
      lastName: "LastName2",
      email: "friend-test2@test.com",
      password: "12345678",
    });

    await user1.save();
    await user2.save();
    token1 = createToken(user1.id);
    token2 = createToken(user2.id);
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  describe("POST /:id (addFriendRequest)", () => {
    test("responds with a 200 and success message", async () => {
      //user1 sends friend request to user2
      const response = await request(app)
        .post(`/friends/${user2.id}`)
        .set("Authorization", `Bearer ${token1}`);
      expect(response.status).toEqual(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.message).toEqual("Friend request sent successfully");
    });

    test("adds request to sender's sentFriendRequests and receiver's receivedFriendRequests", async () => {
      //user1 sends friend request to user2
      await request(app)
        .post(`/friends/${user2.id}`)
        .set("Authorization", `Bearer ${token1}`);
      const sender = await User.findById(user1.id);
      const receiver = await User.findById(user2.id);
      expect(sender.sentFriendRequests).toHaveLength(1);
      expect(sender.sentFriendRequests[0].user.toString()).toEqual(user2.id);
      expect(sender.sentFriendRequests[0].status).toEqual("pending");

      expect(receiver.receivedFriendRequests).toHaveLength(1);
      expect(receiver.receivedFriendRequests[0].user.toString()).toEqual(
        user1.id,
      );
      expect(receiver.receivedFriendRequests[0].status).toEqual("pending");
    });

    test("responds with 400 and an error message when user try to send friend request twice", async () => {
      await request(app)
        .post(`/friends/${user2.id}`)
        .set("Authorization", `Bearer ${token1}`);

      //This is the duplicate request
      const response = await request(app)
        .post(`/friends/${user2.id}`)
        .set("Authorization", `Bearer ${token1}`);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Friend request already sent");
    });

    test("responds with a 400 and an error message if we try to send a friend request to a user who is already a friend", async () => {
      //user1 sends friend request to user2
      await request(app)
        .post(`/friends/${user2.id}`)
        .set("Authorization", `Bearer ${token1}`);

      //user2 accepts friend requests
      await request(app)
        .patch(`/friends/${user1.id}/accept`)
        .set("Authorization", `Bearer ${token2}`);

      //user1 sends friend request to user2 again
      const response = await request(app)
        .post(`/friends/${user2.id}`)
        .set("Authorization", `Bearer ${token1}`);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Already friends");
    });
  });

  describe("GET / (getFriends)", () => {
    test("responds with a 200 and a success message", async () => {
      const response = await request(app)
        .get(`/friends/`)
        .set("Authorization", `Bearer ${token1}`);
      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual(
        "List of friends retrieved successfully",
      );
    });

    test("returns an empty list when user has no friends", async () => {
      const response = await request(app)
        .get(`/friends/`)
        .set("Authorization", `Bearer ${token1}`);

      expect(response.body.friends).toHaveLength(0);
      expect(response.body.friends).toEqual([]);
    });

    test("returns a list of friends when user has friends", async () => {
      //user1 sends friend request to user 2
      await request(app)
        .post(`/friends/${user2.id}`)
        .set("Authorization", `Bearer ${token1}`);

      //user2 accepts the friend request from user 1
      await request(app)
        .patch(`/friends/${user1.id}/accept`)
        .set("Authorization", `Bearer ${token2}`);

      //get lists of friends
      const response = await request(app)
        .get(`/friends/`)
        .set("Authorization", `Bearer ${token1}`);

      expect(response.body.friends).toHaveLength(1);
      expect(response.body.friends[0]._id).toEqual(user2.id);
    });
  });

  describe("GET /other-users (getOtherUsers)", () => {
    test("responds with a 200 and a success message", async () => {
      const response = await request(app)
        .get(`/friends/other-users`)
        .set("Authorization", `Bearer ${token1}`);
      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual(
        "List of other users retrieved successfully",
      );
    });

    test("returns a list of other users when users has no friends and no friend requests have been made", async () => {
      const response = await request(app)
        .get(`/friends/other-users`)
        .set("Authorization", `Bearer ${token1}`);

      expect(response.body.otherUsers).toHaveLength(1);
      expect(response.body.otherUsers[0]._id).toEqual(user2.id);
    });

    test("returns an empty list after a friend request has been sent", async () => {
      //user1 sends friend request to user 2
      await request(app)
        .post(`/friends/${user2.id}`)
        .set("Authorization", `Bearer ${token1}`);

      const response = await request(app)
        .get(`/friends/other-users`)
        .set("Authorization", `Bearer ${token1}`);

      expect(response.body.otherUsers).toHaveLength(0);
      expect(response.body.otherUsers).toEqual([]);
    });

    test("returns an empty list when the users are in friends list", async () => {
      //user1 sends friend request to user 2
      await request(app)
        .post(`/friends/${user2.id}`)
        .set("Authorization", `Bearer ${token1}`);

      //user2 accepts the friend request from user 1
      await request(app)
        .patch(`/friends/${user1.id}/accept`)
        .set("Authorization", `Bearer ${token2}`);

      const response = await request(app)
        .get(`/friends/other-users`)
        .set("Authorization", `Bearer ${token1}`);

      expect(response.body.otherUsers).toHaveLength(0);
      expect(response.body.otherUsers).toEqual([]);
    });
  });

  describe("GET /friend-requests (getFriendRequests)", () => {
    test("responds with a 200 and a success message", async () => {
      const response = await request(app)
        .get(`/friends/friend-requests`)
        .set("Authorization", `Bearer ${token1}`);
      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual(
        "Friend requests retrieved successfully",
      );
    });

    test("returns an empty list if the user has not recieved any friend requests", async () => {
      const response = await request(app)
        .get(`/friends/friend-requests`)
        .set("Authorization", `Bearer ${token1}`);

      expect(response.body.friendRequests).toHaveLength(0);
      expect(response.body.friendRequests).toEqual([]);
    });

    test("returns a list of friend requests when user have receieved a friend request", async () => {
      //user2 sends friend request to user 1
      await request(app)
        .post(`/friends/${user1.id}`)
        .set("Authorization", `Bearer ${token2}`);

      const response = await request(app)
        .get(`/friends/friend-requests`)
        .set("Authorization", `Bearer ${token1}`);

      console.log(response.body.friendRequests);
      expect(response.body.friendRequests).toHaveLength(1);
      expect(response.body.friendRequests[0].user._id).toEqual(user2.id);
    });
  });

  describe("PATCH /:id/accept (acceptFriendRequest)", () => {
    test("responds with a 200 and a success message", async () => {
      //user2 sends friend request to user1
      await request(app)
        .post(`/friends/${user1.id}`)
        .set("Authorization", `Bearer ${token2}`);

      //user1 accepts friend requests
      const response = await request(app)
        .patch(`/friends/${user2.id}/accept`)
        .set("Authorization", `Bearer ${token1}`);

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual(
        "Friend request accepted successfully",
      );
    });

    test("adds each users to the other's friend array", async () => {
      //user2 sends friend request to user1
      await request(app)
        .post(`/friends/${user1.id}`)
        .set("Authorization", `Bearer ${token2}`);

      //user1 accepts friend requests
      await request(app)
        .patch(`/friends/${user2.id}/accept`)
        .set("Authorization", `Bearer ${token1}`);

      const sender = await User.findById(user2.id);
      const receiver = await User.findById(user1.id);

      expect(sender.friends).toHaveLength(1);
      expect(sender.friends[0].toString()).toEqual(user1.id);

      expect(receiver.friends).toHaveLength(1);
      expect(receiver.friends[0].toString()).toEqual(user2.id);
    });

    test("removes each user from the other's friend request array", async () => {
      //user2 sends friend request to user1
      await request(app)
        .post(`/friends/${user1.id}`)
        .set("Authorization", `Bearer ${token2}`);

      // user1 accepts friend requests
      await request(app)
        .patch(`/friends/${user2.id}/accept`)
        .set("Authorization", `Bearer ${token1}`);

      const sender = await User.findById(user2.id);
      const receiver = await User.findById(user1.id);

      expect(sender.sentFriendRequests).toHaveLength(0);
      expect(sender.sentFriendRequests).toEqual([]);

      expect(receiver.receivedFriendRequests).toHaveLength(0);
      expect(receiver.receivedFriendRequests).toEqual([]);
    });

    test("responds with a 400 and an error message if user tries to accept a friend request that doesn't exist", async () => {
      //user1 accepts friend requests
      const response = await request(app)
        .patch(`/friends/${user2.id}/accept`)
        .set("Authorization", `Bearer ${token1}`);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Friend request does not exist");
    });

    test("responds with a 400 and an error message if user tries to accept a friend request of user who is already a friend", async () => {
      //user2 sends friend request to user1
      await request(app)
        .post(`/friends/${user1.id}`)
        .set("Authorization", `Bearer ${token2}`);

      //user1 accepts friend requests
      await request(app)
        .patch(`/friends/${user2.id}/accept`)
        .set("Authorization", `Bearer ${token1}`);

      //user1 trys to accept it again
      const response = await request(app)
        .patch(`/friends/${user2.id}/accept`)
        .set("Authorization", `Bearer ${token1}`);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Already friends");
    });
  });

  describe("PATCH /:id/delete (deleteFriendRequest)", () => {
    test("responds with a 200 and a success message", async () => {
      //user2 sends friend request to user1
      await request(app)
        .post(`/friends/${user1.id}`)
        .set("Authorization", `Bearer ${token2}`);

      //user1 deletes friend requests
      const response = await request(app)
        .patch(`/friends/${user2.id}/delete`)
        .set("Authorization", `Bearer ${token1}`);

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual(
        "Friend request deleted successfully",
      );
    });

    test("removes each user from the other's friend request array", async () => {
      //user2 sends friend request to user1
      await request(app)
        .post(`/friends/${user1.id}`)
        .set("Authorization", `Bearer ${token2}`);

      // user1 deletes friend requests
      await request(app)
        .patch(`/friends/${user2.id}/delete`)
        .set("Authorization", `Bearer ${token1}`);

      const sender = await User.findById(user2.id);
      const receiver = await User.findById(user1.id);

      expect(sender.sentFriendRequests).toHaveLength(0);
      expect(sender.sentFriendRequests).toEqual([]);

      expect(receiver.receivedFriendRequests).toHaveLength(0);
      expect(receiver.receivedFriendRequests).toEqual([]);
    });

    test("responds with a 400 and an error message if user tries to delete a friend request that doesn't exist", async () => {
      //user1 deletes friend requests
      const response = await request(app)
        .patch(`/friends/${user2.id}/delete`)
        .set("Authorization", `Bearer ${token1}`);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Friend request does not exist");
    });

    test("responds with a 400 and an error message if user tries to delete a friend request of user who is already a friend", async () => {
      //user2 sends friend request to user1
      await request(app)
        .post(`/friends/${user1.id}`)
        .set("Authorization", `Bearer ${token2}`);

      //user1 accepts friend requests
      await request(app)
        .patch(`/friends/${user2.id}/accept`)
        .set("Authorization", `Bearer ${token1}`);

      //user1 tries to delete it
      const response = await request(app)
        .patch(`/friends/${user2.id}/delete`)
        .set("Authorization", `Bearer ${token1}`);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Already friends");
    });
  });

  describe("PATCH /:id/remove (removeFriend)", () => {
    test("responds with a 200 and a success message", async () => {
      //user2 sends friend request to user1
      await request(app)
        .post(`/friends/${user1.id}`)
        .set("Authorization", `Bearer ${token2}`);

      //user1 accepts friend requests
      await request(app)
        .patch(`/friends/${user2.id}/accept`)
        .set("Authorization", `Bearer ${token1}`);

      const response = await request(app)
        .patch(`/friends/${user2.id}/remove`)
        .set("Authorization", `Bearer ${token1}`);

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual("Friend removed successfully");
    });

    test("removes each users from the other's friend array", async () => {
      //user2 sends friend request to user1
      await request(app)
        .post(`/friends/${user1.id}`)
        .set("Authorization", `Bearer ${token2}`);

      //user1 accepts friend requests
      await request(app)
        .patch(`/friends/${user2.id}/accept`)
        .set("Authorization", `Bearer ${token1}`);

      //user1 removes user2 from friends
      await request(app)
        .patch(`/friends/${user2.id}/remove`)
        .set("Authorization", `Bearer ${token1}`);

      const remover = await User.findById(user1.id);
      const removed = await User.findById(user2.id);

      expect(remover.friends).toHaveLength(0);
      expect(remover.friends).toEqual([]);

      expect(removed.friends).toHaveLength(0);
      expect(removed.friends).toEqual([]);
    });

    test("responds with a 400 and an error message if user tries to delete a friend request of user who is already a friend", async () => {
      //user1 removes user2 from friends
      const response = await request(app)
        .patch(`/friends/${user2.id}/remove`)
        .set("Authorization", `Bearer ${token1}`);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Users are not friends");
    });
  });
});
