const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const Err = require('../utils/err');

const User = require('../models/user');
const JWT_SECRET = "3sMtjlsBQ9DZYeoFIgMmR1cp40LZYFAAdne4HHOvwuH9QqIgGW";

exports.register = (req, res, next) => {
    const errors = validationResult(req).toArray();

    if(errors.length>0){
        return res.status(400).json({msg: "Invalid user input.", err: errors});
    }

    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    User.findOne({email: email}).then(user => {
        if(user){
            return res.status(403).json({msg: "This email already exists."});
        }

        bcrypt.hash(password, 20)
        .then(hash => {
            const newUser = new User({username, email, password: hash});
            newUser.save().then(response => {
                res.status(201).json({msg: "User created succesfully!"});
            }).catch(err => {
                const error = new Error("Couldn't create a user.");
                error.statusCode = 409;
                throw error;
            });
        }).catch(err => Err.err(err));
    })
}

exports.login = (req, res, next) => {
    const errors = validationResult(req).toArray();

    if(errors.length>0){
        return res.status(400).json({msg: "Invalid user input.", err: errors});
    }

    const email = req.body.email;
    const password = req.body.password;
    const rememberMe = req.body.rememberMe;

    const userPayload = {};

    User.findOne({email: email})
    .then(user => {
        if(!user){
            return res.status(404).json({msg: "User with such an email not found."});
        }
        bcrypt.compare(password, user.password)
        .then(isValid => {
            if(!isValid){
                return  res.status(400).json({msg: "Passwords not match."});
            }

            const token = jwt.sign({
                uid: user._id.toString()
            }, JWT_SECRET, {expiresIn: "1h"});

            userPayload.UID = user._id.toString();
            userPayload.token = {
                token, 
                expire: new Date().setHours(new Date().getHours + 1)
            };

            if(rememberMe){
                const rememberMeToken = jwt.sign({
                    username: user.username,
                    email: email
                }, JWT_SECRET, {expiresIn: "30d"});

                userPayload.rememberMeToken = {
                    token: rememberMeToken,
                    expire: new Date().setMonth(new Date().getMonth() + 1)
                };
            }

            res.status(200).json({msg: "Logged in.", auth: userPayload});
        })
    }).catch(err => Err.err(err))
}