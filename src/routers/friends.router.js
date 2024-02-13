const express = require('express');
const User = require('../models/users.model');
const { checkAuthenticated } = require('../middlewares/auth');
const router = express.Router();

router.get('/', checkAuthenticated, async (req, res) => {
    const users = await User.find({})
        try {
            res.render('friends', {
                users : users
            });
        } catch (err) {
            res.redirect('/posts');
        };
});

router.put('/:id/add-friend', checkAuthenticated, async (req, res) => {
    const user = await User.findById(req.params.id, (err, user) => {
        try {
            User.findByIdAndUpdate(user._id, {
                friendsRequests: user.friendsRequests.concat([req.user.id])
            }, (err, _) => {
                res.redirect('back');
            })
        } catch (err) {
            res.redirect('back');
        }
    })
})

router.put('/:firstId/remove-friend-request/:secondId', checkAuthenticated, async (req, res) => {
    const user = await User.findById(req.params.firstId, (err, user) => {
        try {
            const filteredFriendsRequests = user.friendsRequests.filter(friendId => friendId !== req.params.secondId);
            User.findByIdAndUpdate(user._id, {
                friendsRequests: filteredFriendsRequests
            }, (err, _) => {
                res.redirect('back');
            })
        } catch (err) {
            res.redirect('back');
        }
    })
})

module.exports = router;