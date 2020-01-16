const express = require('express');
// axios는 다른 서버에 요청을 보내는 간단한 라이브러리
// axios.메서드(주소, 옵션)
const axios = require('axios');

const router = express.Router();

router.get('/test', async (req, res, next) => {
    try {
        if(!req.session.jwt) {
            const tokenResult = await axios.post('http://localhost:8002/v1/token', {
                clientSecret : process.env.CLIENT_SECRET,
            });
            if (tokenResult.data && tokenResult.data.code === 200) {
                req.session.jwt = tokenResult.data.token;
            } else {
                return res.json(tokenResult.data);
            }
        }
        const result = await axios.get('http://localhost:8002/v1/test', {
            headers: { authorization: req.session.jwt },
        });
        return res.json(result.data);
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

module.exports = router;