// 기존 콜백 방식
// 실행 순서를 파악하기 어려운 단점이 있음
// 콜백 지옥에 빠짐
Users.findOne('zero', (err, user) => {
    if (err) {
        return console.error(error);
    }
    console.log(user);
    User.update('zero', 'nero', (err, updateUser) => {
       console.log(updateUser);
       User.remove('nero', (err, removedUser) => {
           console.log(removedUser);
       });
    });
});

// 프로미스로 바꾼 코드

Users.findOne('zero')
    .then((user) => {
        console.log(user);
        return User.update('zero', 'nero');
    })
    .then((updatedUser) => {
        console.log(updatedUser);
        return Users.remove('nero');
    })
    .then((removedUser) => {
        console.log(removedUser);
    })
    .catch((err) => {
        console.error(error);
    });

console.log('done?');

// 프로미스 만드는 법
// 구조
const plus = new Promise((resolve , reject) => {
    // 임의 코딩
    const a = 1;
    const b = 2;
    if (a + b > 2 ) {
        // 성공시
        resolve(a + b);
    } else {
        // 실패시
        reject(a + b);
    }
});

// 사용
plus
    .then((success) => {
        console.log(success);
    })
    .catch((fail) => {
        console.error(fail);
    });