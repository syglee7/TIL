const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('dotenv').config(); //.env 파일이 process. env에 들어감

const { sequelize } = require('./models');
const passportConfig = require('./passport');

const authRouter = require('./routes/auth');
const indexRouter = require('./routes');
const v1 = require('./routes/v1');
const v2 = require('./routes/v2');


const app = express();
sequelize.sync();
passportConfig(passport);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT || 8002);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    }
}));

app.use(flash());
app.use(passport.initialize());
// 매 요청시마다 여기에 걸리면 deserializeUser 가 실행됨
// user.id 를 DB 조회 후 req.user 로
app.use(passport.session());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/v1', v1);
app.use('/v2', v2);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(`${app.get('port')} 번 포트에서 서버 실행중`);
});