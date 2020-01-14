const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const { User } = require('../models');

module.exports = (passport) => {
    // 로그인 할 때 한번만 호출된다
    passport.serializeUser((user, done) => {
        // { id:1, name: zena, age: 29 }
       done(null, user.id); // 정보를 전체 저장하지 않고 아이디만 가지고 있음
    });

    // 요청이 갈 때마다 매번 호출된다.
    passport.deserializeUser((id, done) => {

        User.find({
            where : { id },
            include: [{
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followers',
            }, {
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followings',
            }],
        }) // 이 결과가 req.user 에 저장
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    local(passport);
    kakao(passport);
};