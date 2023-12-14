const express = require('express');
const router = express.Router();
const { checkAuthenticated } = require('../middlewares/auth');

router.get('/', checkAuthenticated, (req, res) => {
    res.render('posts');
})

module.exports = router;