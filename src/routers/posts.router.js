const express = require('express');
const router = express.Router();
const { checkAuthenticated } = require('../middlewares/auth');
const Post = require('../models/posts.model');
const Comment = require('../models/comments.model');
const multer = require('multer');
const path = require('path');

const storageEngine = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, '../public/assets/images'));
    },
    filename: (req, file, callback) => { 
        callback(null, file.originalname);
    }
});

const upload = multer({ storage: storageEngine }).single('image');

router.post('/', checkAuthenticated, upload, (req, res, next) => {
    let desc = req.body.desc;
    let image = req.file ? req.file.filename : "";
    Post.create({
        image: image,
        destination: desc,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }, (err, post) => {
        if(err) {
            next(err);
        } else {
            res.redirect("posts");
        };
    });
});

router.get('/', checkAuthenticated, (req, res) => {
    Post.find()
        .populate('comments')
        .sort({ createdAt: -1 })
        .then((posts) => {
            res.render('posts', {
                    posts: posts,
                    currentUser: req.user
            });
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = router;