const express = require("express");
const router = express.Router();
// const User = require("../models/userModel.js");
const { signup, login } = require("../controllers/authController.js");

router.post("/signup", signup);

// module.exports = router;


// ✅ LOGIN ROUTE
router.post("/login", login);

module.exports = router;
