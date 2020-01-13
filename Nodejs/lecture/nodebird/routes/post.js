const express = require('express');
// 이미지를 업로드하려면 폼을 multipart/form-data로,
// 그리고 이거 해석하려면 multer 가 필요
const multer = require('multer');
const path = require('path');
const { Post, Hashtag } = require('../models');
const router = express.Router();

const upload = multer({
    storage: multer.diskStorage({
        // destination : 파일 경로, cb(에러, 결과값)
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            // 파일명 중복을 막기 위해 현재 시간을 넣어줌
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
        },
    }),
    limit: { fileSize: 5 * 1024 * 1024 },
});

/*
* single : 이미지 하나 (필드명)
* array : 이미지 여러 개 (단일 필드)
* fields : 이미지 여러 개 (여러 필드)
* none: 이미지 x
* */
router.post('/img', upload.single('img'), (req, res) => {// 'img' = input type='file' 의 name 값
    console.log(req.body, req.file);
    res.json({ url: `/img/${req.file.filename }`});
});

const upload2 = multer();
router.post('/', upload2.none(), async (req, res, next) => {
    // 게시글 업로드
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            userId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s]*/g);
        if (hashtags) {
            const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
                where: { title: tag.slice(1).toLowerCase() },
            })));
            /*
            A.getB : 관계 있는 로우 조회
            A.addB: 관계 생성
            A.setB: 관계 수정
            A.removeB : 관계 제거
            */
            await post.addHashtags(result.map(r => r[0]));
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/hashtag', async (req, res, next) => {
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/');
    }

    try {
        const hashtag = await Hashtag.find({ where: { title: query }});
        let posts = [];
        if (hashtag) {
            post = await hashtag.getPosts({ include})
        }

    } catch (error) {
        console.error(error);
        next(error);
    }
});
module.exports = router;