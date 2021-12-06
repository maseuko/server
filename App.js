const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const isHeadAdmin = require("./middlewares/is-head-admin");
const isAuth = require("./middlewares/is-auth");

const User = require("./models/user");
const School = require("./models/School");
const Course = require("./models/courses");

const COURSEDB = require("./constants/database").CURRENT_COURSES;
const USERDB = require("./constants/database").USERS;
const SCHOOLSDB = require("./constants/database").SCHOOLS;

const auth = require("./routes/auth");
const admin = require("./routes/admin");
const images = require("./routes/images");
const user = require("./routes/endUser");
const headAdmin = require("./routes/headAdmin");
const defaultData = require("./routes/defaultData");

const app = express();

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "OPTIONS, GET, POST, PUT, PATCH, DELETE"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type"
//   );
//   next();
// });

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(defaultData);
app.use(auth);
app.use(images);
app.use([isAuth], admin);
app.use([isAuth], user);
app.use([isAuth, isHeadAdmin], headAdmin);

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
    Course.find({}, (err, course) => {
      if (err) {
        throw err;
      }
      COURSEDB.push(course);
    });

    School.find({}, (err, schools) => {
      if (err) {
        throw err;
      }
      SCHOOLSDB.push(schools);
    });

    User.find({}, (err, user) => {
      if (err) {
        throw err;
      }
      USERDB.push(user);
      app.listen(8080);
    });
  })
  .catch(() => {
    console.log("Couldn't connect with mongoDB.");
  });
