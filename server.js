const express = require("express");
const app = express();
const router = require("./routes");
var cookieParser = require("cookie-parser");
const dbConfig = require("./configs/dbConfig");
const cloudinaryConfig = require("./configs/cloudinary");
require("dotenv").config();
app.use(express.json());
app.use(cookieParser());
cloudinaryConfig();
app.use(router);
dbConfig();

app.listen(8000, () => {
  console.log("Server is running");
});
