// Import the Express framework and required modules
const express = require('express');
const router = express.Router();
const { getLoginPage, getHomePage, postLoginForm, postSignupForm, logout } = require("../controller/controller.js");
const authenticateUser = require("../middlewares/authenticationMiddleware.js");

// Define routes and associate them with corresponding controller functions
router.post("/login", postLoginForm); // Handle user login
router.post("/signup", postSignupForm); // Handle user signup
router.get("/", getLoginPage); // Render login page
router.get("/logout", authenticateUser, logout); // Handle user logout with authentication
router.get("/home", authenticateUser, getHomePage); // Render home page with authentication

// Export the router for use in other modules
module.exports = router;
