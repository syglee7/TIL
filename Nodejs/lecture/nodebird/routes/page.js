const express = require('express');
const { Post, User } = require('../models');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

// 프로필 페이지
router.get('/profile', isLoggedIn,  (req, res) => {
    res.render('profile', { title: '내 정보 - NodeBird', user: null });
});

// 회원가입 페이지
router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {
        title: '회원가입 - NodeBird',
        user : req.user,
        joinError: req.flash('joinError'),
    });
});
// 메인 페이지
router.get('/', (req, res, next) => {
    Post.findAll({
        include: { // mysql join
            model: User,
            attributes: ['id', 'nick'],
        },
    })
        .then((posts) => {
            res.render('main', {
                title: 'NodeBird',
                twits : posts,
                user: req.user, //deserializeUser가 실행 될 때 불러온 값
                loginError: req.flash('loginError'),
            });
        })
        .catch((error) => {
            console.error(error);
            next(error);
        });
});

module.exports = router;