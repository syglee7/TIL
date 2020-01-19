const express = require('express');
// axios는 다른 서버에 요청을 보내는 간단한 라이브러리
// axios.메서드(주소, 옵션)
const axios = require('axios');

const router = express.Router();

router.get('/test', async (req, res, next) => {
    try {
        if(!req.session.jwt) {
            const tokenResult = await axios.post('http://localhost:8002/v2/token', {
                clientSecret : process.env.CLIENT_SECRET,
            });
            if (tokenResult.data && tokenResult.data.code === 200) {
                req.session.jwt = tokenResult.data.token;
            } else {
                return res.json(tokenResult.data);
            }
        }
        const result = await axios.get('http://localhost:8002/v2/test', {
            headers: { authorization: req.session.jwt },
        });
        return res.json(result.data);
    } catch (error) {
        console.error(error);
        if (error.response.status === 419) { //토큰 만료 에러
            return res.json(error.response.data);
        }
        return next(error);
    }
});

const request = async (req, api) => {
    try {
        if (!req.session.jwt) {
            const tokenResult = await axios.post('http://localhost:8002/v2/token', {
                clientSecret: process.env.CLIENT_SECRET,
            });
            req.session.jwt = tokenResult.data.token;
        }
        return await axios.get(`http://localhost:8002/v2${api}`, {
            headers: { authorization: req.session.jwt },
        });
    } catch (error) {
        console.error(error);
        if (error.response.status < 500) {
            return error.response;
        }
        throw error;
    }
};

router.get('/mypost', async (req, res, next) => {
    try {
        const result = await request(req, '/posts/my');
        res.json(result.data);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/search/:hashtag', async (req, res, next) => {
    try {
        const result = await request(
            req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`,
        );
        res.json(result.data);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;