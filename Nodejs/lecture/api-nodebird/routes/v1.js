const express = require('express');
const router = express.Router();
const { verifyToken, deprecated } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');
const jwt = require('jsonwebtoken');
// 라우터에 공통되는 미들웨어 한 번에 적용 가능.
router.use(deprecated);
// API 서버의 응답 형식은 하나로 통일 해주는 것이 좋음 (JSON 등)
router.post('/token', async (req, res) => {
   const { clientSecret } = req.body;
   try {
       const domain = await Domain.find({
           where : { clientSecret },
           include: {
               model: User,
               attribute: ['nick', 'id'],
           },
       });

       if (!domain) {
           return res.status(401).json({
               code: 401,
               message: '등록되지 않은 도메인 입니다. 먼저 도메인을 등록하세요.',
           })
       }
       const token = jwt.sign({
           id: domain.user.id,
           nick: domain.user.nick,
       }, process.env.JWT_SECRET, {
           expiresIn: '1m',
           issuer: 'nodebird',
       });
       return res.json({
           code: 200,
           message: '토큰이 발급 되었습니다.',
           token
       })
   } catch (error) {
       return res.status(500).json({
           code: 500,
           message: '서버에러',
       });
   }
});

router.get('/test', verifyToken, (req, res) => {
    res.json(req.decoded);
});

router.get('/posts/my', verifyToken, (req, res) => {
   Post.findAll({ where: { userId: req.decoded.id} })
       .then((posts) => {
           console.log(posts);
           res.json({
               code: 200,
               payload: posts,
           });
       })
       .catch((error) => {
           console.error(error);
           return res.status(500).json({
               code: 500,
               message: '서버에러',
           });
       })
});

router.get('/posts/hashtag/:title', verifyToken, async (req, res) => {
    try {
        const hashtag = await Hashtag.find({ where: { title: req.params.title }});
        if (!hashtag) {
            return res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다'
            });
        }

        const posts = await hashtag.getPosts();
        return res.json({
            code: 200,
            payload: posts,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버에러'
        })
    }
});

module.exports = router;