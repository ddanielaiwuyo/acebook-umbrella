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
        message: "Invalid credentials, must contain email and password ",
      });
      return;
    }

    if (!emailIsValid(email)) {
      res.status(400).json({ message: "Invalid email address" });
      return;
    }

    if (password.trim().length < PASSWORD_MIN_LENGTH) {
      console.log("password too short", password, password.length);
      res.status(400).json({
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
        .json({ message: `User with email ${email} already exists` });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = new User({ email: email, password: hashedPassword });
    await newUser.save();

    console.info(`User with email: ${email} saved successfully`);
    res.status(201).json({ message: "Created successfully" });
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

const UsersController = {
  create: create,
};

module.exports = UsersController;
