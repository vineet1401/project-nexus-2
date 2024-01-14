// Import necessary modules and dependencies
const userModel = require('../model/userSchema');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

// Handle user login form submission
const postLoginForm = async (req, res) => {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Find user in the database based on the provided email
    const user = await userModel.findOne({ email });

    // Check if user exists and the password is correct
    if (user && (await bcrypt.compare(password, user.password))) {
        // Generate a JWT token with the user's ID
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

        // Set the token as a cookie and redirect to the home page
        res.cookie("token", token);
        return res.redirect("/home");
    } else {
        // Render the login form with an error message for invalid credentials
        res.render("form.ejs", { loginerror: "Invalid email or password" });
    }
};

// Handle user signup form submission
const postSignupForm = async (req, res) => {
    // Extract username, email, and password from the request body
    const { username, email, password } = req.body;

    // Check if the provided username or email is already registered
    const usernameTaken = await userModel.findOne({ username: username });
    const emailTaken = await userModel.findOne({ email: email });

    // If username or email is taken, render the signup form with an error message
    if (usernameTaken || emailTaken) {
        res.render("form.ejs", { signuperror: "Username already Registered" });
    } else {
        try {
            // Hash the password and create a new user in the database
            const hashpassword = await bcrypt.hash(password, 10);
            const user = await userModel.create({
                username: username,
                password: hashpassword,
                email: email
            });

            // Generate a JWT token with the new user's ID
            const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

            // Set the token as a cookie and redirect to the home page
            res.cookie("token", token);
            return res.redirect("/home");
        } catch (err) {
            // Handle errors during user creation and render the signup form with an error message
            console.error('Error in postSignupForm:', err);
            res.render("form.ejs", { signuperror: "Try Again" });
        }
    }
};

// Handle user logout
const logout = (req, res) => {
    // Clear the token cookie and redirect to the home page
    res.clearCookie("token");
    return res.redirect('/');
};

// Render the home page
const getHomePage = (req, res) => {
    try {
        res.render("index.ejs");
    } catch (error) {
        // Handle errors during rendering and send a 500 Internal Server Error response
        console.error('Error in getHomePage:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Render the login page
const getLoginPage = (req, res) => {
    try {
        res.render("form.ejs");
    } catch (error) {
        // Handle errors during rendering and send a 500 Internal Server Error response
        console.error('Error in getLoginPage:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Export the functions for use in other modules
module.exports = { getLoginPage, getHomePage, postLoginForm, postSignupForm, logout };
