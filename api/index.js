const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const secret = 'sJwuLvmJg4KJmckvsnkkLyyp';
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/'});
const fs = require('fs');

const salt = bcrypt.genSaltSync(10);
 
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname + '/uploads'));

mongoose.connect('mongodb+srv://nehashenoyBlog:sJwuLvmJg4KJLyyp@cluster0.jbwjtng.mongodb.net/')
.then(() => {
    console.log("Connected to DB")
})
.catch((err) => {
    console.log("Error connecting to DB", err)
});

app.post('/register', async(req,res) => {
    try {
        const {username,password} = req.body;
        const userDoc = await User.create({
            username, 
            password:bcrypt.hashSync(password,salt),
        });
        res.json(userDoc);
    } catch (err) {
        res.status(400).json({"error": err})
    }
});

// 

app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const userDoc = await User.findOne({ username });
  
      if (!userDoc) {
        // User not found
        return res.status(404).json('User not found');
      }
      
      const passOk = bcrypt.compareSync(password, userDoc.password);
      console.log(passOk);
  
      if (passOk) {
        // Password is correct
        const token = jwt.sign({ username, id: userDoc._id }, secret, { expiresIn: '1h' });
        res.cookie('token', token).json({
            id:userDoc._id,
            username,
        });
      } else {
        // Incorrect password
        res.status(401).json('Incorrect password');
      }
    } catch (error) {
      // Internal server error
      console.error(error);
      res.status(500).json('Internal server error');
    }
  });

app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err,info) => {
        if(err) throw err;
        res.json(info);
    });
});

app.post('/logout', (req,res) => {
    res.cookie('token', '').json('ok');
})

app.post('/post',uploadMiddleware.single('file'), async (req,res) => {
    const{originalname,path} =req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length-1];
    const newPath = path+'.'+ext;
    fs.renameSync(path,newPath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
        if(err) throw err;
        const{title,summary,content} = req.body;
        const postDoc = await Post.create({
        title,
        summary,
        content,
        cover:newPath,
        author:info.id,
    });
    res.json(postDoc);
    });  

    });

app.put('/post', uploadMiddleware.single('file'), async (req,res) => {
    let newPath = null;
    if(req.file){
        const{originalname,path} =req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length-1];
        newPath = path+'.'+ext;
        fs.renameSync(path,newPath);
    }

  
const {token} = req.cookies;
jwt.verify(token, secret, {}, async (err,info) => {
    if(err) throw err;
    const {id,title,summary,content} = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if(!isAuthor){
        return res.status(400).json('You are not the author');
    }
    const updatedPostDoc = await postDoc.update({
    title,
    summary,
    content,
    cover:newPath ? newPath : postDoc.cover,
    
});
    res.json(updatedPostDoc);
});
});

app.get('/post', async (req,res) => {
    res.json(await Post.find()
    .populate('author',['username'])
    .sort({createdAt: -1})
    .limit(20)
    );
});

app.get('/post/:id', async (req,res) => {
    const {id} =req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
})

app.listen(4000, () => console.log("Server started."));