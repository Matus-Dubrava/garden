const router = require('express').Router();
const passport = require('passport');
const jwt = require('jwt-simple');

const User = require('../models/user');
const secret = require('../config').jwtSecret;

const localLogin = passport.authenticate('local', { session: false });
const tokenLogin = passport.authenticate('jwt', { session: false });

function getToken(user) {
    return jwt.encode(user, secret);
}

router.get('/test', tokenLogin, (req, res) => {
    res.json('authentication successful');
});

router.post('/signin', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(422).send('Incomplete form data');
    } else {
        const user = new User(username, password);

        user.saveUser()
            .then(rows => {
                res.json(rows);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send('internal error');
            });
    }
});

router.post('/login', localLogin, (req, res) => {
    res.json(getToken(req.user));
});

module.exports = router;
