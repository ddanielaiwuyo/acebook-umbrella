const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function sendMessage(userId, content) {
	try {
		const token = localStorage.getItem("token");
		const requestOptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ content }),
		};
		const response = await fetch(
			`${BACKEND_URL}/messages/${userId}`,
			requestOptions,
		);

		if (response.status !== 201) {
			throw new Error("Unable to send message");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Could not make request for sendMessage");
		console.error(error);
		return {
			message: "Service is down please try again later",
			ok: false,
		};
	}
}

export async function getInbox() {
	try {
		const token = localStorage.getItem("token");
		const requestOptions = {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
		const response = await fetch(
			`${BACKEND_URL}/messages/inbox`,
			requestOptions,
		);

		if (response.status !== 200) {
			throw new Error("Unable to get inbox");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Could not make request for getInbox");
		console.error(error);
		return {
			message: "Service is down please try again later",
			ok: false,
		};
	}
}

export async function getConversation(userId) {
	try {
		const token = localStorage.getItem("token");
		const requestOptions = {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
		const response = await fetch(
			`${BACKEND_URL}/messages/${userId}`,
			requestOptions,
		);

		if (response.status !== 200) {
			throw new Error("Unable to get conversation");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Could not make request for getConversation");
		console.error(error);
		return {
			message: "Service is down please try again later",
			ok: false,
		};
	}
}

export async function markAsRead(userId) {
	try {
		const token = localStorage.getItem("token");
		const requestOptions = {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
		const response = await fetch(
			`${BACKEND_URL}/messages/${userId}/read`,
			requestOptions,
		);

		if (response.status !== 200) {
			throw new Error("Unable to mark as read");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Could not make request for markAsRead");
		console.error(error);
		return {
			message: "Service is down please try again later",
			ok: false,
		};
	}
}
