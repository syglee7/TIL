const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models');
const bcrypt = require('bcrypt');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email', //req.body.email
        passwordField: 'password', //req.body.password
    }, async (email, password, done) => {
        //done(에러, 성공, 실패)
        //done(서버에러) ,  done(null, 사용자정보) , done(null, false, 실패정보)
        try {
            const exUser = await User.find({ where: { email }});
            if (exUser) {
                const result = await bcrypt.compare(password, exUser.password);
                if (result) {
                    done(null, exUser);
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.'});
                }
            } else {
                done(null, false, { message: '가입되지 않은 회원 입니다.'});
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};