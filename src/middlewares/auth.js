const Post = require('../models/posts.model');
const Comment = require('../models/comments.model')
const User = require('../models/users.model');
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

async function checkIsMe(req, res, next) {
    if(req.isAuthenticated()) {
        const user = await User.findById(req.params.id)
            try {
                if(user._id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('/profile/' + req.params.id);
                }
            } catch (err) {
                res.redirect('/profile/' + req.params.id);
            }
    } else {
        res.redirect('/login');
    }
}

module.exports = {
    checkIsMe,
    checkCommentOwnership,
    checkPostOwnerShip,
    checkAuthenticated,
    checkNotAuthenticated
}