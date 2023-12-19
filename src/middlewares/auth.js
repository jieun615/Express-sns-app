const Post = require('../models/posts.model');
const Comment = require('../models/comments.model')
function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/posts');
    }
    next();
}

async function checkPostOwnerShip (req, res, next) {
    if(req.isAuthenticated()) {
    const post = await Post.findById(req.params.id);
        try {
            if(post.author.id.equals(req.user._id)) {
                req.post = post;
                next();
            } else {
                res.redirect('back');
            }
        } catch (err) {
            res.redirect('posts');
        }
    } else {
        res.redirect('/login');
    }
}

async function checkCommentOwnership(req, res, next) {
    if(req.isAuthenticated()) {
        const comment = await Comment.findById(req.params.commentId)
        try {
            if(comment.author.id.equals(req.user._id)) {
                req.comment = comment;
                next();
            } else {
                res.redirect('back');
            }
        } catch (err) {
            res.redirect('back');
        }
    } else {
        res.redirect('/login');
    }
}

module.exports = {
    checkCommentOwnership,
    checkPostOwnerShip,
    checkAuthenticated,
    checkNotAuthenticated
}