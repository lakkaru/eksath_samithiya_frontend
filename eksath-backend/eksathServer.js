const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const connectDB = require("./config/DB");

const authRoutes = require("./routes/authRoutes");
const memberRoutes = require("./routes/memberRoutes");
const loanRoutes = require("./routes/loanRoutes");

const PORT = process.env.PORT || 5000;

const app = express();
// Connect to MongoDB
connectDB();
// app.use(cors());
app.use(cors({
    origin: 'https://wil.lakkaru.com', // Replace with your frontend's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Explicitly handle OPTIONS requests
app.options('*', (req, res) => {
    res.sendStatus(204); // No Content
});
app.use(express.json());

//routes
app.use("/auth", authRoutes);
app.use("/member", memberRoutes);
app.use("/loan", loanRoutes);

//Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
