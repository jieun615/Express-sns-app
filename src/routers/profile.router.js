const express = require('express');
const { checkAuthenticated, checkIsMe } = require('../middlewares/auth');
const router = express.Router({
    mergeParams: true
});
const Post = require('../models/posts.model');
const User = require('../models/users.model');

router.get('/', checkAuthenticated, async (req, res) => {
    try {
        const posts = await Post.find({ "author.id": req.params.id })
            .populate('comments')
            .sort({ createdAt: -1 })
            .exec();
        const user = await User.findById(req.params.id);
        if(!user) {
            res.redirect('/back');
        }
        res.render('profile', {
            posts: posts,
            user: user
        });
    } catch (err) {
        res.redirect('back');
    }
})

router.get('/edit', checkIsMe, (req, res) => {
    res.render('profile/edit', {
        user: req.user
    })
})

router.put('/', checkIsMe, async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body)
    try {
        res.redirect('/profile/' + req.params.id);
    } catch (err) {
        res.redirect('back');
    }
})

module.exports = router;