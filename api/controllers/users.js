const bcrypt = require("bcrypt");
const User = require("../models/user");

const EMAIL_MIN_LENGTH = 5;
const PASSWORD_MIN_LENGTH = 8;
const SALT_ROUNDS = 10;

async function create(req, res) {
	try {
		const { firstName, lastName, email, password } = req.body;
		if (!email || !password) {
			res.status(400).json({
				ok: false,
				message: "Invalid credentials, must contain email and password ",
			});
			return;
		}

		if (!emailIsValid(email)) {
			res.status(400).json({ ok: false, message: "Invalid email address" });
			return;
		}

		if (password.trim().length < PASSWORD_MIN_LENGTH) {
			console.log("password too short", password, password.length);
			res.status(400).json({
				ok: false,
				message: `Password too short, must be at least ${PASSWORD_MIN_LENGTH}`,
			});
			return;
		}

		// Now check if user with that email already exists
		const userExists = await User.findOne({ email: email });
		if (userExists) {
			console.log(`User with email: ${email} already exists `);
			res
				.status(409)
				.json({ ok: false, message: `User with email ${email} already exists` });
			return;
		}

		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
		const newUser = new User({
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: hashedPassword,
		});

		await newUser.save();

		console.info(`User with email: ${email} saved successfully`);
		res.status(201).json({ ok: true, message: "Created successfully" });
	} catch (err) {
		console.error("Could not create user");
		console.error(err);
		res
			.status(500)
			.json({ message: "Service is down, please try again later" });
	}
}

function emailIsValid(email) {
	let formattedEmail = email.trim().toLowerCase();
	if (
		formattedEmail.length >= EMAIL_MIN_LENGTH &&
		formattedEmail.includes("@")
	) {
		return true;
	}

	return false;
}

async function search(req, res) {
	const { query } = req.query;

	if (!query || query.trim() === "") {
		return res.json({ users: [] });
	}

	try {
        const parts = query.trim().split(/\s+/);
        
        let searchCondition;
        if (parts.length >= 2) {
            searchCondition = {
                $and: [
                    { firstName: { $regex: parts[0], $options: "i" } },
                    { lastName: { $regex: parts[parts.length - 1], $options: "i" } },
                ]
            };
        } else {
            searchCondition = {
                $or: [
                    { firstName: { $regex: query, $options: "i" } },
                    { lastName: { $regex: query, $options: "i" } },
                ]
            };
        }

        const users = await User.find(searchCondition).select("firstName lastName _id");


		res.status(200).json({ ok: false, message: "OK", users });
	} catch (err) {
		console.log("Could not complete user's search query");
		console.log(err);
		res.status(500).json({ message: "Server is down, please try again later", ok: false });
	}
}

const UsersController = {
	create: create,
	search: search,
};

module.exports = UsersController;
