require("dotenv").config(); // MUST be first

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const entryRoutes = require("./routes/entryRoutes");

const requiredEnv = ["MONGO_URI", "JWT_SECRET"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length) {
  console.error(
    `Missing required environment variables: ${missingEnv.join(", ")}`,
  );
  process.exit(1);
}

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());

const allowedOrigins = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173", "https://mindvault-lime.vercel.app"];

app.use(
  cors({
    origin: (incomingOrigin, callback) => {
      if (!incomingOrigin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(incomingOrigin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`Origin ${incomingOrigin} not allowed by CORS`),
        false,
      );
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/entries", entryRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("MindVault API Running");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server Error" });
});

// Port setup
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
