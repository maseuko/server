const express = require('express');
const mongoose = require('mongoose');

const auth = require('./routes/auth');

const app = express();

app.use(express.json());
app.use(auth);

mongoose.connect("mongodb+srv://fiszki:EeCvno0cLPJeNudM@cluster0.tveju.mongodb.net/fiszki?retryWrites=true&w=majority")
.then(res => {
    app.listen(process.env.PORT || 8080);
}).catch(() => {
    console.log("Couldn't connect with mongoDB.");
});

const jebacDisa = "OrkaAnubisa";
