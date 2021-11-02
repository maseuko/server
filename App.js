const express = require("express");
const mongoose = require("mongoose");

const auth = require("./routes/auth");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  next();
});

app.use(express.json());
app.use(auth);

app.use((err, req, res, next) => {
  console.log(err);
  if (err.statusCode) {
    return res.status(err.statusCode).json({ msg: err });
  }
  res.status(500).json({ msg: "Server failed." });
});

mongoose
  .connect(
    "mongodb+srv://fiszki:EeCvno0cLPJeNudM@cluster0.tveju.mongodb.net/fiszki?retryWrites=true&w=majority"
  )
  .then((res) => {
    app.listen(8080);
  })
  .catch(() => {
    console.log("Couldn't connect with mongoDB.");
  });
