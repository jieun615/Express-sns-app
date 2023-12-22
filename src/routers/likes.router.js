const express = require('express');
const { checkAuthenticated } = require('../middlewares/auth');
const router = express.Router();
const Post = require('../models/posts.model');

router.put('/posts/:id/like', checkAuthenticated, async (req, res) => {
    const post = await Post.findById(req.params.id)
    try {
        if(post.likes.find(like => like === req.user._id.toString())) {
            const updatedLikes = post.likes.filter(like => like !== req.user._id.toString());
            await Post.findByIdAndUpdate(post._id, {
                likes: updatedLikes
            })
        } else {
            await Post.findByIdAndUpdate(post._id, {
                likes: post.likes.concat([req.user._id])
            })
        } 
        res.redirect('back');
    } catch (err) {
        res.redirect('back');
    }
});

module.exports = router;