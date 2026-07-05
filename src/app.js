const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const showRoutes = require("./routes/show"); 

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", showRoutes);

module.exports = app;