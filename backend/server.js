const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./src/routes/userRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");

const connectDB= require("./src/config/mongo.config")

const app = express();
app.use(cors());
app.use(express.json());




app.get("/", (req, res) => res.send("Finance Tracker API running"));

app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);



// Start server only after DB connects
const startServer = async () => {
  try {
    await connectDB();
    app.listen(5000, () => {
      console.log("✅ Server is running on http://localhost:5000");
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
  }
};

startServer();