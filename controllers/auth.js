const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Err = require("../utils/err");
const sendgrid = require("@sendgrid/mail");
const constants = require("../constants/constants");
const crypto = require("crypto");

sendgrid.setApiKey(constants.SENDGRID_KEY);

const User = require("../models/user");
const JWT_SECRET = constants.JWT_SECRET;

exports.register = async (req, res, next) => {
  const errors = validationResult(req).toArray();

  if (errors.length > 0) {
    return res.status(400).json({ msg: "Invalid user input.", err: errors });
  }

  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(403).json({ msg: "This email already exists." });
    }
    const hash = await bcrypt.hash(password, 20);
    crypto.randomBytes(32, async (err, buffer) => {
      const token = buffer.toString("hex");
      const newUser = new User({
        username,
        email,
        password: hash,
        isAuthorized: false,
        authorizedToken: token,
      });
      const savedUser = await newUser.save();
      const mail = await sendgrid.send({
        from: "mateuszgorczowski3@gmail.com",
        to: email,
        subject: "Witaj na pokladzie!",
        html: `<h1>Cześć ${username}</h1>
                        <p>Potwierdz swoje konto klikając w link: <a href="${
                          "http://localhost:3000/" +
                          savedUser._id.toString() +
                          "/" +
                          token
                        }"></a></p>
                `,
      });
      res.status(201).json({ msg: "User created succesfully!" });
    });
  } catch (err) {
    const error = new Error("Couldn't create a user.");
    error.statusCode = 409;
    throw error;
  }
};

exports.login = (req, res, next) => {
  const errors = validationResult(req).toArray();

  if (errors.length > 0) {
    return res.status(400).json({ msg: "Invalid user input.", err: errors });
  }

  const email = req.body.email;
  const password = req.body.password;
  const rememberMe = req.body.rememberMe;

  const userPayload = {};

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ msg: "User with such an email not found." });
      }
      bcrypt.compare(password, user.password).then((isValid) => {
        if (!isValid) {
          return res.status(400).json({ msg: "Passwords not match." });
        }

        const token = jwt.sign(
          {
            uid: user._id.toString(),
          },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        userPayload.UID = user._id.toString();
        userPayload.token = {
          token,
          expire: new Date().setHours(new Date().getHours + 1),
        };

        if (rememberMe) {
          const rememberMeToken = jwt.sign(
            {
              username: user.username,
              email: email,
            },
            JWT_SECRET,
            { expiresIn: "30d" }
          );

          userPayload.rememberMeToken = {
            token: rememberMeToken,
            expire: new Date().setMonth(new Date().getMonth() + 1),
          };
        }

        res.status(200).json({ msg: "Logged in.", auth: userPayload });
      });
    })
    .catch((err) => Err.err(err));
};

exports.authorizeAccount = async (req, res, next) => {
  const uid = req.params.uid;
  const token = req.params.token;

  try {
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }
    if (user.isAuthorized) {
      return res.status(403).json({ msg: "User already authorized." });
    }
    if (user.authorizedToken !== token) {
      return res.status(403).json({ msg: "Tokens not match." });
    }
    user.isAuthorized = true;
    await user.save();
    res.status(200).json({ msg: "Account authorized." });
  } catch (err) {
    const error = new Error("Couldn't authorize user.");
    error.statusCode = 400;
    throw error;
  }
};
