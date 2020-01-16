const jwt = require('jsonwebtoken');
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) { // 로그인 여부 req.login, req.logout
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) { // 로그인을 안 했을때
        next();
    } else {
        res.redirect('/');
    }
};

exports.verifyToken = (req, res, next) => {
    try {
        //jwt.verify(토큰, 시크릿)
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(419).json({ //토큰 만료 에러
                code: 419,
                message: '토큰이 만료 되었습니다.',
            });
        }
        return res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰입니다.',
        });
    }
};