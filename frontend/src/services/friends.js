const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function addFriend(userId) {
  try {
    const token = localStorage.getItem("token");
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(
      `${BACKEND_URL}/friends/${userId}`,
      requestOptions,
    );

    if (response.status !== 200) {
      throw new Error("Unable to add friend");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Could not make request for addFriend");
    console.error(error);
    return { message: "Service is down please try again later", ok: false };
  }
}

export async function getFriends() {
  try {
    const token = localStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(`${BACKEND_URL}/friends/`, requestOptions);

    if (response.status !== 200) {
      throw new Error("Unable to get friend");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Could not make request for getFriends");
    console.error(error);
    return { message: "Service is down please try again later", ok: false };
  }
}

//This service gets other users to be added to people you may know
export async function getOtherUsers() {
  try {
    const token = localStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(
      `${BACKEND_URL}/friends/other-users`,
      requestOptions,
    );

    if (response.status !== 200) {
      throw new Error("Unable to get other users");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Could not make request for getOtherUsers");
    console.error(error);
    return { message: "Service is down please try again later", ok: false };
  }
}

//This service gets receieved friend requests
export async function getFriendRequests() {
  try {
    const token = localStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(
      `${BACKEND_URL}/friends/friend-requests`,
      requestOptions,
    );

    if (response.status !== 200) {
      throw new Error("Unable to get friend requests");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Could not make request for getFriendRequests");
    console.error(error);
    return { message: "Service is down please try again later", ok: false };
  }
}

//This service accepts friend requests
export async function acceptFriendRequest(userId) {
  try {
    const token = localStorage.getItem("token");
    const requestOptions = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(
      `${BACKEND_URL}/friends/${userId}/accept`,
      requestOptions,
    );

    if (response.status !== 200) {
      throw new Error("Unable to accept friend request");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Could not make request for acceptFriendRequest");
    console.error(error);
    return { message: "Service is down please try again later", ok: false };
  }
}

//This service deletes friend requests
export async function deleteFriendRequest(userId) {
  try {
    const token = localStorage.getItem("token");
    const requestOptions = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(
      `${BACKEND_URL}/friends/${userId}/delete`,
      requestOptions,
    );

    if (response.status !== 200) {
      throw new Error("Unable to delete friend request");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Could not make request for deleteFriendRequest");
    console.error(error);
    return { message: "Service is down please try again later", ok: false };
  }
}

//This service removes friends
export async function removeFriend(userId) {
  try {
    const token = localStorage.getItem("token");
    const requestOptions = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(
      `${BACKEND_URL}/friends/${userId}/remove`,
      requestOptions,
    );

    if (response.status !== 200) {
      throw new Error("Unable to remove friend");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Could not make request for removeFriend");
    console.error(error);
    return { message: "Service is down please try again later", ok: false };
  }
}
