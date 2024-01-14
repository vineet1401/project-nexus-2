// Import necessary modules and dependencies
const jwt = require('jsonwebtoken');
const userModel = require('../model/userSchema.js');
const env = require("dotenv").config();

// Middleware to authenticate user based on JWT token
const authenticateUser = (req, res, next) => {
    // Retrieve the token from cookies in the request
    const cookies = req.cookies;
    const token = cookies.token;

    // Check if token is missing
    if (!token) {
        return res.render('form.ejs', { signuperror: 'Unauthorized: Missing token', loginerror: 'Unauthorized: Missing token' });
    }

    // Verify the token using the secret key
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        // Handle invalid or expired tokens
        if (err) {
            return res.render('form.ejs', { signuperror: "Unauthorized: Invalid Token", loginerror: "Unauthorized: Invalid Token" });
        }

        // Retrieve user information based on the decoded user ID
        try {
            const user = await userModel.findOne({ _id: decoded.userId });

            // Check if the user exists
            if (user) {
                // Attach the user ID to the request and proceed to the next middleware or route
                req.user = decoded.userId;
                next();
            } else {
                // Render an error if the user is not found
                return res.render("form.ejs", { signuperror: "Unauthorized: User not found", loginerror: "Unauthorized: User not found" });
            }
        } catch (err) {
            // Render an error if an exception occurs during user retrieval
            return res.render("form.ejs", { signuperror: "Unauthorized: User not found", loginerror: "Unauthorized: User not found" });
        }
    });
};

// Export the authentication middleware for use in other modules
module.exports = authenticateUser;
