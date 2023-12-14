const express = require('express');
const router = express.Router();
const { checkAuthenticated } = require('../middlewares/auth');
const Post = require('../models/posts.model');
const Comment = require('../models/comments.model');

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