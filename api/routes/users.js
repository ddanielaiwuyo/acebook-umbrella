const express = require("express");
const UsersController = require("../controllers/users");
const tokenChecker = require("../middleware/tokenchecker");

const router = express.Router();

router.post("/", UsersController.create);
router.get("/search", tokenChecker, UsersController.search);

module.exports = router;
