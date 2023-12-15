const Post = require('../models/posts.model');

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

function checkPostOwnerShip (req, res, next) {
    if(req.isAuthenticated()) {
        Post.findById(req.params.id, (err, post) => {
            if(err || !post) {
                req.flash('error', '포스트가 없거나 에러가 발생함');
                res.redirect('posts');
            } else {
                if(post.author.id.equals(req.user._id)) {
                    req.post = post;
                    next();
                } else {
                    req.flash('error', '권한이 없음');
                    res.redirect('back');
                }
            }
        })
    } else {
        req.flash('error', '로그인 먼저 해주세요.');
        res.redirect('/login');
    }
}

module.exports = {
    checkPostOwnerShip,
    checkAuthenticated,
    checkNotAuthenticated
}