// Import the Mongoose library
const mongoose = require('mongoose');

// Define the user schema with username, email, and password fields
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
});

// Create a Mongoose model named 'User' based on the user schema
const userModel = mongoose.model('User', userSchema);

// Export the user model for use in other modules
module.exports = userModel;
