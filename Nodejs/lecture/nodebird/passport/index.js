const local = require('./localStrategy');
const kakao = require('./kakakoStrategy');
const { User } = require('../models');

const user = {};

module.exports = (passport) => {
    // 로그인 할 때 한번만 호출된다
    passport.serializeUser((user, done) => {
        // { id:1, name: zena, age: 29 }
       done(null, user.id); // 정보를 전체 저장하지 않고 아이디만 가지고 있음
    });

    // 요청이 갈 때마다 매번 호출된다.
    passport.deserializeUser((id, done) => {

        if (user[id]) {
            done(user[id]);
        } else {
            User.find({ where : { id } }) // 이 결과가 req.user 에 저장
                .then(user => user[id] = user, done(null, user))
                .catch(err => done(err));
        }
    });

    local(passport);
    //kakao(passport);
};