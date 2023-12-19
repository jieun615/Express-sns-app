const express = require('express');
const { checkAuthenticated } = require('../middlewares/auth');
const router = express.Router({
    mergeParams: true
});
const Post = require('../models/posts.model');
const Comment = require('../models/comments.model');

router.post('/', checkAuthenticated, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        const comment = await Comment.create(req.body)
            try {
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();

                post.comments.push(comment);
                post.save();
                res.redirect('back');
            } catch (err) {
                res.redirect('back');
            }
    } catch (err) {
        res.redirect('back');
    }



    
})

module.exports = router;