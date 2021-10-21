const express = require('express');
const mongoose = require('mongoose');

const auth = require('./routes/auth');

const app = express();

app.use(express.json());
app.use(auth);

app.use((err, req, res, next) => {
    if(err.statusCode){
        return res.status(err.statusCode).json({msg: err.msg});
    }
    res.status(500).json({msg: "Server failed."});
});

mongoose.connect("mongodb+srv://fiszki:EeCvno0cLPJeNudM@cluster0.tveju.mongodb.net/fiszki?retryWrites=true&w=majority")
.then(res => {
    app.listen(process.env.PORT || 8080);
}).catch(() => {
    console.log("Couldn't connect with mongoDB.");
});

