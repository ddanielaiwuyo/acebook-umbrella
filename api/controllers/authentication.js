const User = require("../models/user");
const { generateToken } = require("../lib/token");
const bcrypt = require("bcrypt");

async function createToken(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      console.log("Auth Error: User not found");
      res.status(401).json({ message: "User not found" });
      return;
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (passwordsMatch) {
      console.log("Passwords match");
      const token = generateToken(user.id);
      res.status(200).json({ token: token, message: "OK" });
      return;
    }

    console.log(
      `Invalid credentials. Got ${password}, Expected: ${user.password}`,
    );
    res.status(401).json({ message: "Incorrect email or password" });
  } catch (err) {
    console.error("Unexpected error occured in createToken");
    res
      .status(500)
      .json({ message: "Service is down, please try again later" });
  }
}

const AuthenticationController = {
  createToken: createToken,
};

module.exports = AuthenticationController;
