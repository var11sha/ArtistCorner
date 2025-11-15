import express from "express";
const router = express.Router();
// const User = require("../models/userModel.js");
import { signup, login } from "../controllers/authController.js";

router.post("/signup", signup);

// module.exports = router;


// ✅ LOGIN ROUTE
router.post("/login", login);

export default router;
