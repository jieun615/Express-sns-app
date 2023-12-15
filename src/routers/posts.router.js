const express = require('express');
const router = express.Router();
const { checkAuthenticated, checkPostOwnerShip } = require('../middlewares/auth');
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

router.post('/', checkAuthenticated, upload, async (req, res, next) => {
    try {
        let desc = req.body.desc;
        let image = req.file ? req.file.filename : "";
        
        const post = await Post.create({
            image: image,
            description: desc,
            author: {
                id: req.user._id,
                username: req.user.username
            }
        });
        res.redirect("posts");
    } catch (err) {
        res.redirect("posts");
    };
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

router.get('/:id/edit', checkPostOwnerShip, (req, res) => {
    res.render('posts/edit', {
        post: req.post
    })
})

router.put('/:id', checkPostOwnerShip, (req, res) => {
    Post.findByIdAndUpdate(req.params.id, req.body, (err, post) => {
        if(err) {
            res.redirect('/posts');
        } else {
            res.redirect('/posts');
        }
    })
})

module.exports = router;