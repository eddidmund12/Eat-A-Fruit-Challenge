// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const registerRoute = require("./routes/register");

// const app = express();
// app.use(cors());

// app.use("/api/register", registerRoute);

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });


const connectDB = require("./config/db");

connectDB();


app.use("/api/admin", require("./routes/admin"));


const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*"
}));

app.use("/api/register", require("./routes/register"));
app.use("/api/admin", require("./routes/admin"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));
