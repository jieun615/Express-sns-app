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

module.exports = router;