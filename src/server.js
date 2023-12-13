const cookieSession = require('cookie-session');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const passport = require('passport');
const { checkAuthenticated, checkNotAuthenticated } = require('./middlewares/auth');
const cookieEncryptionKey = ['key1', 'key2'];
const mainRouter = require('./routers/main.router');
const usersRouter = require('./routers/users.router');
const postsRouter = require('./routers/posts.router');
const commentsRouter = require('./routers/comments.router');
const profileRouter = require('./routers/profile.router');
const likesRouter = require('./routers/likes.router');
const friendsRouter = require('./routers/friends.router');
const port = process.env.SERVER_PORT;

app.use(cookieSession({
    name: 'cookie-session-name',
    keys: cookieEncryptionKey
}))

// register regenerate & save after the cookieSession middleware initialization
app.use(function(request, response, next) {
    if (request.session && !request.session.regenerate) {
        request.session.regenerate = (cb) => {
            cb()
        }
    }
    if (request.session && !request.session.save) {
        request.session.save = (cb) => {
            cb()
        }
    }
    next()
})

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('mongodb connected')
    })
    .catch((err) => {
        console.log(err);
    })

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
    setImmediate(() => { next( new Error('it is an error')); })
})

app.use((error, req, res, next) => {
    res.json({ message: error.message });
})

app.use('/', mainRouter);
app.use('/auth', usersRouter);
app.use('/posts', postsRouter);
app.use('/posts/:id/comments', commentsRouter);
app.use('/profile/:id', profileRouter);
app.use('/friends', friendsRouter);
app.use('/posts/:id/like', likesRouter);

app.listen(port, () => {
    console.log(`listening on ${port}`);
});