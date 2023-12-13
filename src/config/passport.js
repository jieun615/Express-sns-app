const passport = require('passport');
const User = require('../models/users.model');
const { access } = require('fs');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
require('dotenv').config();

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id)
    .then(user => {
        done(null, user);
    })
})

const localStrategyConfig =  new LocalStrategy({ usernameField: 'email', passwordField: 'password'}, (email, password, done) => {
    User.findOne({ email: email.toLocaleLowerCase() })
        .then(user => {
            if(!user) {
                return done(null, false, { msg: `Email ${email} not found`});
            }
            user.comparePassword(password, (err, isMatch) => {
                if(err) return done(err);

                if(isMatch) {
                    return done(null, user);
                }
                    return done(null, false, {msg : 'Invalid email or password.'})
            });
        })
        .catch((err)=>{
            return res.status(400).send(err);
        }) 
    }
)

passport.use('local', localStrategyConfig);

const googleClientID = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
const googleStrategyConfig = new GoogleStrategy({
    clientID: googleClientID,
    clientSecret: googleClientSecret,
    callbackURL: '/auth/google/callback',
    scope: ['email', 'profile']
}, async (accessToken, refreshToken, profile, done) => {
    const existingUser = await User.findOne({googleId: profile.id})
        if(existingUser) {
            return done(null, existingUser);
        } else {
            const user = new User();
            user.email = profile.emails[0].value;
            user.googleId = profile.id;
            try{
                await user.save();
            } catch(err){
                console.log(err);
                return done(err);
            }
            done(null, user);
        }
    }
)

passport.use('google', googleStrategyConfig);

const kakaoStrategyConfig = new KakaoStrategy({
    clientID: process.env.KAKAO_CLIENT_ID,
    callbackURL: '/auth/kakao/callback',
}, async (accessToken, refreshToken, profile, done) => {
    const existingUser = await User.findOne({ kakaoId: profile.id })
        if(existingUser){
            return done(null, existingUser);
        } else {
            const user = new User();
            user.kakaoId = profile.id;
            user.email = profile._json.kakao_account.email;
            try{
                await user.save();
            } catch {
                console.log(err);
                return done(err);
            }
            done(null, user);
        }
    }
)

passport.use('kakao', kakaoStrategyConfig);