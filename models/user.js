const mongodb = require('mongoose');
const Schema = mongodb.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongodb.model('User', userSchema);