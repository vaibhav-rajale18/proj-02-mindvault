require("dotenv").config(); // MUST be first

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
res.send("MindVault API Running");
});

// Port setup
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
