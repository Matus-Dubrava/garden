const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');
const secret = require('../config').jwtSecret;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: secret
};

const localLogin = new LocalStrategy((username, password, done) => {
    User.getUser(username)
        .then(user => {
            if (!user) {
                return done(null, false);
            }

            const isMatch = user.verifyPassword(password);
            if (!isMatch) {
                return done(null, false);
            }
            return done(null, user);
        })
        .catch(err => {
            return done(err);
        });
});

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    User.getUser(payload.username)
        .then(user => {
            if (!user) {
                return done(null, false);
            }

            return done(null, user);
        })
        .catch(err => {
            return done(err);
        });
});

passport.use(localLogin);
passport.use(jwtLogin);
