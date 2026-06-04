const express = require("express");
const authRateLimiter = require("../middleware/rateLimiter");

const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

// Register Route
router.post("/register", authRateLimiter, registerUser);

// Login Route
router.post("/login", authRateLimiter, loginUser);

module.exports = router;
