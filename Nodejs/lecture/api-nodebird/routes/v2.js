const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const url = require('url');

const { verifyToken, apiLimiter } = require('./middlewares');
const { Domain, User, Post, HashTag } = require('../models');
const router = express.Router();

// cors 미들웨어가 응답 헤더에 Access-Control-Allow-Origin 를 넣어준다.
//router.use(cors()); // cors('localhost:8001') 처럼 사용 가능
// CORS 요청시에는 OPTIONS 메서드 요청이 가서 Access-Control-Allow-Origin를 검사함.
router.use(async (req, res, next) => { // 미들웨어의 생김새. 위 아래가 같은 소스
    // 미들웨어 안에 미들웨어를 넣어 커스터마이징 할 수 있다.
    const domain = await Domain.find({
        where: { host: url.parse(req.get('origin')).host },
    });
    if (domain) {
        cors({ origin: req.get('origin') })(req, res, next);
    } else {
        next();
    }
});

router.post('/token', apiLimiter, async (req, res) => {
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

router.get('/test', apiLimiter, verifyToken, (req, res) => {
    res.json(req.decoded);
});

router.get('/posts/my', apiLimiter, verifyToken, (req, res) => {
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

router.get('/posts/hashtag/:title', apiLimiter, verifyToken, async (req, res) => {
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