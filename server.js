const express = require("express");
const app = express();
const router = require("./routes");
const dbConfig = require("./configs/dbConfig");
require("dotenv").config();
app.use(express.json());

app.use(router);
dbConfig();

app.listen(8000, () => {
  console.log("Server is running");
});
