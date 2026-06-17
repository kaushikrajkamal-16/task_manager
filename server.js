const express = require("express");
const app = express();
const router = require("./routes");
var cookieParser = require("cookie-parser");
const dbConfig = require("./configs/dbConfig");
require("dotenv").config();
app.use(express.json());
app.use(cookieParser());
app.use(router);
dbConfig();

app.listen(8000, () => {
  console.log("Server is running");
});
