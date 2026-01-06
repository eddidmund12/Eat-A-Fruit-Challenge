// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const registerRoute = require("./routes/register");

const connectDB = require("./config/db");

connectDB();


app.use("/api/admin", require("./routes/admin"));




const app = express();

app.use(cors({
  origin: "*"
}));

app.use("/api/register", require("./routes/register"));
app.use("/api/admin", require("./routes/admin"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));
