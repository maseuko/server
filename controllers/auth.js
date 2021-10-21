const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');

const User = require('../models/user');

exports.register = (req, res, next) => {
    const errors = validationResult(req);

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
                const err = new Error("Couldn't create a user.");
                err.statusCode = 409;
                throw err;
            });
        }).catch(err => {
            if(err.statusCode){
                return next(err);
            }
            const error = new Error("Something went wrong.");
            next(error);
        });
    })
}

exports.login = (req, res, next) => {

}