// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

if (!BACKEND_URL) {
	throw new Error(`
		Could not find backend url to send requests to.
		Found ${BACKEND_URL}, Have you added it to the .env file?
		`);
}

export async function login(email, password) {
	const payload = {
		email: email,
		password: password,
	};

	const requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	};

	const response = await fetch(`${BACKEND_URL}/tokens`, requestOptions);

	// docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
	if (response.status === 201) {
		let data = await response.json();
		console.log("Login response -> ", data);
		return data.token;
	} else {
		throw new Error(
			`Received status ${response.status} when logging in. Expected 201`,
		);
	}
}

export async function signup(email, password) {
	try {
		const payload = {
			email: email,
			password: password,
		};

		const requestOptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		};

		const response = await fetch(`${BACKEND_URL}/users`, requestOptions);
		const data = await response.json()

		return { message: data.message, status: response.status }
	} catch (err) {
		console.error(err)
		return { message: "Service is down, please try again later", status: 500 }
	}
}
