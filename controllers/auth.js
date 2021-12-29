//Zewnetrzne paczki
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendgrid = require("@sendgrid/mail");
const crypto = require("crypto");
const mongoose = require("mongoose");

//Paczki walidacyjne
const Err = require("../utils/err");
const validationChecker = require("../utils/validation-checker");

//Modele
const User = require("../models/user");

//Stale
const constants = require("../constants/constants");
const JWT_SECRET = constants.JWT_SECRET;
const USERS = require("../constants/database").USERS;

sendgrid.setApiKey(constants.SENDGRID_KEY);

exports.register = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  try {
    validationChecker(req);

    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(403).json({ msg: "This email already exists." });
    }
    const hash = await bcrypt.hash(password, 12);
    crypto.randomBytes(32, async (err, buffer) => {
      const token = buffer.toString("hex");
      const newUser = new User({
        username,
        email,
        password: hash,
        isAuthorized: false,
        authorizedToken: token,
        permissions: [],
      });
      const savedUser = await newUser.save();
      res.status(201).json({ msg: "User created succesfully!" });
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
                        }">Kliknij tutaj misiu :*</a></p>
                `,
      });
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const rememberMe = req.body.rememberMe;
  const userPayload = {};

  try {
    validationChecker(req);

    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ msg: "User with such an email not found." });
    }

    const userIndex = USERS[0].findIndex(
      (u) => u._id.toString() === user._id.toString()
    );

    if (!USERS[0][userIndex].sessions) {
      USERS[0][userIndex].sessions = [];
    }
    const isValid = await bcrypt.compare(password, user.password);
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
    const expTimeForToken = new Date();
    expTimeForToken.setHours(expTimeForToken.getHours() + 1);
    userPayload.UID = user._id.toString();
    userPayload.token = {
      token,
      expire: expTimeForToken,
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
      const expTimeForRememberToken = new Date();
      expTimeForRememberToken.setMonth(
        expTimeForRememberToken.getUTCMonth() + 1
      ),
        (userPayload.rememberMeToken = {
          token: rememberMeToken,
          expire: expTimeForRememberToken,
        });
    }
    USERS[0][userIndex].sessions.push(userPayload);
    console.log(USERS[0][userIndex].sessions);
    res
      .setHeader("Content-Type", "application/json")
      .status(200)
      .json({
        msg: "Logged in.",
        auth: userPayload,
        permissions: {
          isHeadAdmin: user.headAdmin,
          permissionArray: user.permissions,
        },
      });
  } catch (err) {
    Err.err(err, next);
  }
};

exports.authorizeAccount = async (req, res, next) => {
  const uid = req.params.uid;
  const token = req.params.token;

  const error = new Error();

  try {
    validationChecker(req);

    const user = await User.findById(uid);

    if (!user) {
      error.statusCode = 404;
      error.msg = "User not found.";
      throw error;
    }
    if (user.isAuthorized) {
      error.statusCode = 403;
      error.msg = "User already authorized.";
      throw error;
    }
    if (user.authorizedToken !== token) {
      error.statusCode = 403;
      error.msg = "Tokens not match.";
      throw error;
    }
    user.isAuthorized = true;
    await user.save();
    res.status(200).json({ msg: "Account authorized." });
  } catch (err) {
    next(err);
  }
};

exports.getReset = (req, res, next) => {
  const error = new Error();

  crypto.randomBytes(32, async (err, buffer) => {
    const token = buffer.toString("hex");

    try {
      console.log(req.body);
      validationChecker(req);

      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        error.statusCode = 404;
        error.msg = "User not found.";
        throw error;
      }

      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      const result = await user.save();

      const mail = await sendgrid.send({
        from: "mateuszgorczowski3@gmail.com",
        to: user.email,
        subject: "Zresetuj swoje haslo wariacie!",
        html: `<h1>Cześć ${user.username}</h1>
                        <p>Chcesz zresetowac swoje haslo.</p>
                        <p>Aby to zrobic, kliknij w link: <a href=
                          "http://localhost:3000/authorize/reset/${user._id.toString()}/${token}">Zresetuj haslo</a></p>
                `,
      });
      res.status(200).json({ msg: "Sendend reset mail." });
    } catch (err) {
      next(err);
    }
  });
};

exports.checkResetToken = async (req, res, next) => {
  const error = new Error();

  try {
    validationChecker(req);
    const user = await User.findById(req.body._id);
    if (!user) {
      error.statusCode = 404;
      error.msg = "There is no such a user.";
      throw error;
    }

    if (!(user.resetToken === req.body.token)) {
      error.statusCode = 400;
      error.msg = "Invalid token.";
      throw error;
    }

    const tokenExpDate = new Date(user.resetTokenExpiration);

    if (!(tokenExpDate > Date.now())) {
      error.statusCode = 400;
      error.msg = "Token expired";
      throw error;
    }

    res.status(200).json({ msg: "Token is valid." });
  } catch (err) {
    next(err);
  }
};

exports.postNewPassword = async (req, res, next) => {
  const newPassword = req.body.password;
  const uid = req.body.uid;
  const passwordToken = req.body.passwordToken;
  const error = new Error();

  try {
    validationChecker(req);
    const user = await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      // _id: mongoose.Types.ObjectId(uid),
    });

    if (!user) {
      error.statusCode = 404;
      error.msg = "There is no such a user.";
      throw error;
    }

    if (!(user.resetToken === passwordToken)) {
      error.statusCode = 400;
      error.msg = "Invalid token.";
      throw error;
    }

    const tokenExpDate = new Date(user.resetTokenExpiration);

    if (!(tokenExpDate > Date.now())) {
      error.statusCode = 400;
      error.msg = "Token expired";
      throw error;
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = newHashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = undefined;
    await user.save();
    res.status(202).json({ msg: "Password changed." });
  } catch (err) {
    next(err);
  }
};

exports.loginChecker = (req, res, next) => {
  const uid = req.body.uid;
  const token = req.body.token;
  const rememberToken = req.body.rememberToken;

  try {
    validationChecker(req);
  } catch (err) {
    next(err);
  }

  const TOKEN = {};
  let ISVALID = false;

  const userIndex = USERS[0].findIndex(
    (u) => u._id.toString() === uid.toString()
  );

  if (userIndex < 0) {
    return res.status(404).json({ msg: "User not found." });
  }

  if (USERS[0][userIndex].sessions) {
    const isInSession = USERS[0][userIndex].sessions.forEach((s) =>
      console.log(s)
    );
  }

  jwt.verify(token, JWT_SECRET, (err, ver) => {
    if (err) {
      jwt.verify(rememberToken, JWT_SECRET, (err2, ver2) => {
        if (err2) {
          return res.status(401).json({ msg: "Tokens not match." });
        }
        const expTimeForToken = new Date();
        expTimeForToken.setHours(expTimeForToken.getHours() + 1);
        const token = jwt.sign(
          {
            uid: user._id.toString(),
          },
          JWT_SECRET,
          { expiresIn: "1h" }
        );
        TOKEN.token = token;
        TOKEN.expire = expTimeForToken;
      });
    } else {
      ISVALID = true;
    }
  });

  if (TOKEN.token || ISVALID) {
    if (TOKEN.token) {
      return res.status(200).json({
        newToken: TOKEN,
        permissions: {
          isHeadAdmin: USERS[0][userIndex].headAdmin,
          permissionArray: USERS[0][userIndex].permissions,
        },
      });
    } else {
      return res.status(200).json({
        permissions: {
          isHeadAdmin: USERS[0][userIndex].headAdmin,
          permissionArray: USERS[0][userIndex].permissions,
        },
      });
    }
  } else {
    return res.status(401).json({ msg: "Unauthorized." });
  }
};
