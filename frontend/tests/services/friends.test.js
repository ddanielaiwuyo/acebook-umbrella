import createFetchMock from "vitest-fetch-mock";
import { describe, expect, vi } from "vitest";

import {
  addFriend,
  getFriends,
  getOtherUsers,
  getFriendRequests,
  acceptFriendRequest,
  deleteFriendRequest,
  removeFriend,
} from "../../src/services/friends";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

global.localStorage = {
  getItem: vi.fn(() => "testToken"),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

// Mock fetch function
createFetchMock(vi).enableMocks();

describe("friends service", () => {
  describe("addFriend", () => {
    test("includes a token with its request", async () => {
      fetch.mockResponseOnce(JSON.stringify({ ok: true }), {
        status: 200,
      });

      await addFriend("123");

      // This is an array of the arguments that were last passed to fetch
      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];
      const options = fetchArguments[1];

      expect(url).toEqual(`${BACKEND_URL}/friends/123`);
      expect(options.method).toEqual("POST");
      expect(options.headers["Authorization"]).toEqual("Bearer testToken");
    });

    test("send request to the correct URL wth the userId", async () => {
      fetch.mockResponseOnce(JSON.stringify({ ok: true }), {
        status: 200,
      });

      await addFriend("456");
      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];

      expect(url).toEqual(`${BACKEND_URL}/friends/456`);
    });

    test("returns data on success", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({
          ok: true,
          message: "Friend request sent successfully",
        }),
        {
          status: 200,
        },
      );

      const response = await addFriend("123");
      expect(response.ok).toEqual(true);
    });

    test("rejects with an error if the status is not 200", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ message: "Something went wrong" }),
        { status: 400 },
      );

      try {
        await addFriend("123");
      } catch (err) {
        expect(err.message).toEqual("Unable to add friend");
      }
    });

    test("returns service down message if fetch throws error", async () => {
      fetch.mockRejectOnce(new Error("Network error"));

      const response = await addFriend("123");
      expect(response.ok).toEqual(false);
      expect(response.message).toEqual(
        "Service is down please try again later",
      );
    });
  });

  describe("getFriends", () => {
    test("includes a token with its request", async () => {
      fetch.mockResponseOnce(JSON.stringify({ friends: [] }), {
        status: 200,
      });

      await getFriends();

      // This is an array of the arguments that were last passed to fetch
      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];
      const options = fetchArguments[1];

      expect(url).toEqual(`${BACKEND_URL}/friends/`);
      expect(options.method).toEqual("GET");
      expect(options.headers["Authorization"]).toEqual("Bearer testToken");
    });

    test("returns data on success", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ friends: ["friend1", "friend2"] }),
        {
          status: 200,
        },
      );

      const response = await getFriends();
      expect(response.friends).toEqual(["friend1", "friend2"]);
    });

    test("rejects with an error if status is not 200", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ message: "Something went wrong" }),
        { status: 400 },
      );

      try {
        await getFriends();
      } catch (err) {
        expect(err.message).toEqual("Unable to get friend");
      }
    });

    test("returns service down message if fetch throws error", async () => {
      fetch.mockRejectOnce(new Error("Network error"));

      const response = await getFriends();
      expect(response.ok).toEqual(false);
      expect(response.message).toEqual(
        "Service is down please try again later",
      );
    });
  });

  describe("getOtherUsers", () => {
    test("includes a token with its request", async () => {
      fetch.mockResponseOnce(JSON.stringify({ otherUsers: [] }), {
        status: 200,
      });

      await getOtherUsers();

      // This is an array of the arguments that were last passed to fetch
      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];
      const options = fetchArguments[1];

      expect(url).toEqual(`${BACKEND_URL}/friends/other-users`);
      expect(options.method).toEqual("GET");
      expect(options.headers["Authorization"]).toEqual("Bearer testToken");
    });

    test("returns data on success", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ otherUsers: ["user1", "user2"] }),
        {
          status: 200,
        },
      );

      const response = await getOtherUsers();
      expect(response.otherUsers).toEqual(["user1", "user2"]);
    });

    test("rejects with an error if the status is not 200", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ message: "Something went wrong" }),
        { status: 400 },
      );

      try {
        await getOtherUsers();
      } catch (err) {
        expect(err.message).toEqual("Unable to get other user");
      }
    });

    test("returns service down message if fetch throws error", async () => {
      fetch.mockRejectOnce(new Error("Network error"));

      const response = await getOtherUsers();
      expect(response.ok).toEqual(false);
      expect(response.message).toEqual(
        "Service is down please try again later",
      );
    });
  });

  describe("getFriendRequests", () => {
    test("includes a token with its request", async () => {
      fetch.mockResponseOnce(JSON.stringify({ friendRequests: [] }), {
        status: 200,
      });

      await getFriendRequests();

      // This is an array of the arguments that were last passed to fetch
      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];
      const options = fetchArguments[1];

      expect(url).toEqual(`${BACKEND_URL}/friends/friend-requests`);
      expect(options.method).toEqual("GET");
      expect(options.headers["Authorization"]).toEqual("Bearer testToken");
    });

    test("returns data on success", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ friendRequests: ["request1", "request2"] }),
        {
          status: 200,
        },
      );

      const response = await getFriendRequests();
      expect(response.friendRequests).toEqual(["request1", "request2"]);
    });

    test("rejects with an error if the status is not 200", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ message: "Something went wrong" }),
        { status: 400 },
      );

      try {
        await getFriendRequests();
      } catch (err) {
        expect(err.message).toEqual("Unable to get friend requests");
      }
    });

    test("returns service down message if fetch throws error", async () => {
      fetch.mockRejectOnce(new Error("Network error"));

      const response = await getFriendRequests();
      expect(response.ok).toEqual(false);
      expect(response.message).toEqual(
        "Service is down please try again later",
      );
    });
  });

  describe("acceptFriendRequest", () => {
    test("includes a token with its request", async () => {
      fetch.mockResponseOnce(JSON.stringify({ ok: true }), {
        status: 200,
      });

      await acceptFriendRequest("123");

      // This is an array of the arguments that were last passed to fetch
      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];
      const options = fetchArguments[1];

      expect(url).toEqual(`${BACKEND_URL}/friends/123/accept`);
      expect(options.method).toEqual("PATCH");
      expect(options.headers["Authorization"]).toEqual("Bearer testToken");
    });

    test("send request to the correct URL wth the userId", async () => {
      fetch.mockResponseOnce(JSON.stringify({ ok: true }), {
        status: 200,
      });

      await acceptFriendRequest("456");
      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];

      expect(url).toEqual(`${BACKEND_URL}/friends/456/accept`);
    });

    test("returns data on success", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({
          ok: true,
          message: "Friend request accepted successfully",
        }),
        {
          status: 200,
        },
      );

      const response = await acceptFriendRequest("123");
      expect(response.ok).toEqual(true);
    });

    test("rejects with an error if the status is not 200", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ message: "Something went wrong" }),
        { status: 400 },
      );

      try {
        await acceptFriendRequest("123");
      } catch (err) {
        expect(err.message).toEqual("Unable to accept friend request");
      }
    });

    test("returns service down message if fetch throws error", async () => {
      fetch.mockRejectOnce(new Error("Network error"));

      const response = await acceptFriendRequest("123");
      expect(response.ok).toEqual(false);
      expect(response.message).toEqual(
        "Service is down please try again later",
      );
    });
  });

  describe("deleteFriendRequest", () => {
    test("includes a token with its request", async () => {
      fetch.mockResponseOnce(JSON.stringify({ ok: true }), {
        status: 200,
      });

      await deleteFriendRequest("123");

      // This is an array of the arguments that were last passed to fetch
      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];
      const options = fetchArguments[1];

      expect(url).toEqual(`${BACKEND_URL}/friends/123/delete`);
      expect(options.method).toEqual("PATCH");
      expect(options.headers["Authorization"]).toEqual("Bearer testToken");
    });

    test("send request to the correct URL wth the userId", async () => {
      fetch.mockResponseOnce(JSON.stringify({ ok: true }), {
        status: 200,
      });

      await deleteFriendRequest("456");
      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];

      expect(url).toEqual(`${BACKEND_URL}/friends/456/delete`);
    });

    test("returns data on success", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({
          ok: true,
          message: "Friend request deleted successfully",
        }),
        {
          status: 200,
        },
      );

      const response = await deleteFriendRequest("123");
      expect(response.ok).toEqual(true);
    });

    test("rejects with an error if the status is not 200", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ message: "Something went wrong" }),
        { status: 400 },
      );

      try {
        await deleteFriendRequest("123");
      } catch (err) {
        expect(err.message).toEqual("Unable to delete friend request");
      }
    });

    test("returns service down message if fetch throws error", async () => {
      fetch.mockRejectOnce(new Error("Network error"));

      const response = await deleteFriendRequest("123");
      expect(response.ok).toEqual(false);
      expect(response.message).toEqual(
        "Service is down please try again later",
      );
    });
  });

  describe("removeFriend", () => {
    test("includes a token with its request", async () => {
      fetch.mockResponseOnce(JSON.stringify({ ok: true }), {
        status: 200,
      });

      await removeFriend("123");

      // This is an array of the arguments that were last passed to fetch
      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];
      const options = fetchArguments[1];

      expect(url).toEqual(`${BACKEND_URL}/friends/123/remove`);
      expect(options.method).toEqual("PATCH");
      expect(options.headers["Authorization"]).toEqual("Bearer testToken");
    });

    test("send request to the correct URL wth the userId", async () => {
      fetch.mockResponseOnce(JSON.stringify({ ok: true }), {
        status: 200,
      });

      await removeFriend("456");
      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];

      expect(url).toEqual(`${BACKEND_URL}/friends/456/remove`);
    });

    test("returns data on success", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({
          ok: true,
          message: "Friend removed successfully",
        }),
        {
          status: 200,
        },
      );

      const response = await removeFriend("123");
      expect(response.ok).toEqual(true);
    });

    test("rejects with an error if the status is not 200", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ message: "Something went wrong" }),
        { status: 400 },
      );

      try {
        await removeFriend("123");
      } catch (err) {
        expect(err.message).toEqual("Unable to remove friend");
      }
    });

    test("returns service down message if fetch throws error", async () => {
      fetch.mockRejectOnce(new Error("Network error"));

      const response = await removeFriend("123");
      expect(response.ok).toEqual(false);
      expect(response.message).toEqual(
        "Service is down please try again later",
      );
    });
  });
});
