const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv/config");

app.use(cors());
app.options("*", cors);

app.use(express.json());
app.use(morgan("tiny"));
const api = process.env.API_URL;

mongoose.set("strictQuery", true);
const userRoute = require("./route/user");
const transactionRoute = require("./route/transaction");

app.use(`${api}/user`, userRoute);
app.use(`${api}/transaction`, transactionRoute);

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    dbName: "ass",
  })
  .then(() => {
    console.log("Database Connection is connected...");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log("Server is running in localhost:3000");
});
