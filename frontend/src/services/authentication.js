// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error(`
		Could not find backend url to send requests to.
		Found ${BACKEND_URL}, Have you added it to the .env file?
		`);
}

const SERVICE_DOWN_MESSAGE = {
  message: "Service is down, please try again later",
  status: 500,
};

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

  try {
    // docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
    const response = await fetch(`${BACKEND_URL}/tokens`, requestOptions);
    const data = await response.json();
    return {
      message: data.message,
      status: response.status,
      token: data?.token,
    };
  } catch (err) {
    console.error("Could not make fetch request for login");
    console.error(err);
    return SERVICE_DOWN_MESSAGE;
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
    const data = await response.json();

    return { message: data.message, status: response.status };
  } catch (err) {
    console.error(err);
    return { message: "Service is down, please try again later", status: 500 };
  }
}
