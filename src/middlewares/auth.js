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

async function checkPostOwnerShip (req, res, next) {
    try {
        if(req.isAuthenticated()) {
        const post = Post.findById(req.params.id);
            if(!post) {
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
        } else {
            req.flash('error', '로그인 먼저 해주세요.');
            res.redirect('/login');
        }
    } catch (err) {
        console.error('Error in checkPostOwnership:', err);
        req.flash('error', '에러가 발생했습니다.');
        return res.redirect('back');
    }
    
}

module.exports = {
    checkPostOwnerShip,
    checkAuthenticated,
    checkNotAuthenticated
}