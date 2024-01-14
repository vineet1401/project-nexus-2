// Import necessary modules and dependencies
const express = require("express");
const path = require("path");
const router = require("./routes/routes.js");
const mongoose = require("mongoose");
const env = require("dotenv").config();
const cookieParser = require("cookie-parser");

// Function to establish a connection to MongoDB
const dbConnect = async () => {
    try {
        // Connect to MongoDB using the provided connection string
        const db = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("MongoDB connection established at", db.connection.host);
    } catch (err) {
        // Log and exit the process in case of connection errors
        console.error(err);
        process.exit(1);
    }
}

// Call the function to connect to MongoDB
dbConnect();

// Create an Express application
const app = express();

// Configure the app
app.use(cookieParser()); // Use cookie-parser middleware
app.set('view engine', 'ejs'); // Set the view engine to EJS
app.use(express.static(path.join(__dirname))); // Serve static files from the current directory
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Use the defined router for all routes
app.use("/", router);

// Start the server and listen on port 8080
app.listen(8080, () => {
    console.log("Listening on port 8080");
});
