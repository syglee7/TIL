const KakaoStrategy = require('passport-kakao').Strategy;

const { User } = require('../models');

// 2번 4번
module.exports = (passport) => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,  //카카오 앱 아이디
        callbackURL: '/auth/kakao/callback',  // 카카오 리다이렉트 주소 (프로필 반환)
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const exUser = await User.find({
                where: {
                    snsId: profile.id,
                    provider: 'kakao',
                },
            });

            if (exUser) {
                done(null, exUser);
            } else {
                console.log(profile);
                const newUser = await User.create({
                    email: profile._json && profile._json.kaccount_email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }

    }));
};