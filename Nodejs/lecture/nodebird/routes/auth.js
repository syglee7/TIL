const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();
// POST /auth/join
router.post('/join', isNotLoggedIn, async (req, res, next) => {
   const { email, nick, password } = req.body;
   try {
       const exUser = await User.find({ where: { email }});
       if (exUser) {
           req.flash('joinError', '이미 가입된 이메일 입니다.');
           return res.redirect('/join');
       }
       console.time('암호화시간');
       const hash = await bcrypt.hash(password, 12);
       console.timeEnd('암호화시간');
       await User.create({
           email,
           nick,
           password: hash,
       });
       return res.redirect('/');
   } catch (error) {
       console.error(error);
       next(error);
   }
});

router.post('/login', isNotLoggedIn,(req, res, next) => { // req.body.email, req.body.password
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.Error(authError);
            return next(authError);
        }

        if (!user) {
            req.flash('loginError', info.message);
            return res.redirect('/');
        }

        return req.login(user, (loginError) => { //req.user (세션에다 저장 할때 passport 실행)
           if (loginError) {
               console.error(loginError);
               return next(loginError);
           }

           return res.redirect('/');
        });
    })(req, res, next);
});

// GET /auth/logout

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy(); //req.user  다른 세선도 같이 지워짐
    res.redirect('/');

});

module.exports = router;