const express = require('express');
const User = require('../models/users.model');
const { checkAuthenticated } = require('../middlewares/auth');
const { sendDataToProcessId } = require('pm2');
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

router.put('/:id/accept-friend-request', checkAuthenticated, async (req, res) => {
    const senderUser = User.findById(req.params.id, (err, senderUser) => {
        try {
            User.findByIdAndUpdate(senderUser._id, {
                friends: senderUser.friends.concat([req.user._id])
            }, (err, _) => {
                if (err) {
                    res.redirect('back');
                } else {
                    User.findByIdAndUpdate(req.user._id, {
                        friends: req.user.friends.concat([senderUser._id]),
                        friendsRequests: req.user.friendsRequests.filter(friendId => friendId !== senderUser._id.toString())
                    }, (err, _) => {
                        res.redirect('back');
                    })
                }
            })
        } catch (err) { 
            res.redirect('back');
        }
    })
})

router.put('/:id/remove-friend', checkAuthenticated, async (req, res) => {
    const user = await User.findById(req.params.id, (err, user) => {
        try {
            User.findByIdAndUpdate(user._id, {
                friends: user.friends.filter(friendId => friendId !== req.user._id.toString())
            }, (err, _) => {
                if(err) {
                    res.redirect('back');
                } else {
                    User.findByIdAndUpdate(req.user._id, {
                        friends: req.user.friends.filter(friendId => friendId !== req.params.id.toString())
                    }, (err, _) => {
                        res.redirect('back');
                    })
                }
                
            })
        } catch (err) {
            res.redirect('back');
        }
    })
})

module.exports = router;