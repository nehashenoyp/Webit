const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require("mongoose");
const User = require('./models/User');

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://nehashenoy22:kxnaCHIZIvWW4yk9@cluster0.bmqfhdr.mongodb.net/');

app.post('/register',async (req,res) => {
    const {username,password} = req.body;
    const userDoc = await User.create({username,password});
    res.json(userDoc);
});

app.listen(4000);