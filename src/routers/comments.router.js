const express = require('express');
const { checkAuthenticated, checkCommentOwnership } = require('../middlewares/auth');
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

router.delete('/:commentId', checkCommentOwnership, async (req, res) => {
    await Comment.findByIdAndDelete(req.params.commentId)
    res.redirect('back');
})

router.get('/:commentId/edit',checkCommentOwnership, async (req, res) => {
    const post = await Post.findById(req.params.id)
    try {
        res.render('comments/edit', {
            post: post,
            comment: req.comment,
        })
    } catch (err) {
        res.redirect('back');
    }
})

module.exports = router;