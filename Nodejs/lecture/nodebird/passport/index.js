const local = require('./localStrategy');
const kakao = require('./kakakoStrategy');

modules.exports = (passport) => {
    local(passport);
    kakao(passport);
};