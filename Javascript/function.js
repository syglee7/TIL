/* 순수함수: 부수효과가 없고 같은 인자를 주었을때 늘 같은 결과가 나오는 함수
* 평가 시점이 중요하지 않다. (조합성 강조 가능)
* */

function add(a,b) {
    return a + b;
}

console.log( add(10, 5) );
console.log( add(10, 5) );
console.log( add(10, 5) );
console.log( add(10, 5) );

// c 의 값이 변함에 따라 값이 달라지므로 순수함수 x
var c = 10;

function add2(a, b) {
    return a + b + c;
}

console.log(add2(10,2));
console.log(add2(10,3));
console.log(add2(10,4));

c = 20;
// 결과가 변경되므로 add2 는 순수함수가 아님
console.log(add2(10,2));
console.log(add2(10,3));
console.log(add2(10,4));

// 부수 효과 (리턴 값 이외에 바깥의 인자값 변경)이 있으므로 순수함수가 아님
function add3(a, b) {
    c = b;
    return a + b;
}

// 리턴값도 없고 obj1의 상태를 직접 변경하므로 순수함수가 아님
var obj1 = { var : 10 };
function add4(obj, b) {
    obj.val += b;
}


// 다시 순수 함수. 값변경도 없고 리턴도 있음
var obj1 = { var : 10 };
function add5(obj, b) {
    return { val: obj.val + b }
}


/* 일급함수 : 함수를 값으로 다룰 수 있음 */
var f1 = function(a) { return a * a; };
console.log(f1);

var f2 = add;
console.log(f2);

function f3(f) {
    return f();
}

console.log(f3(function() { return 10; }));

console.log(f3(function() { return 20; }));


/* add_maker 일류함수이자 순수함수 */

function add_maker(a) {
    return function(b) { // a를 기억하는 클로저
        return a + b;
    }
}

var add10 = add_maker(10);

console.log( add10(20) );

var add5 = add_maker(5);
var add15 = add_maker(15);

console.log( add5(10) );
console.log( add15(10) );

function f4(f1, f2, f3) {
    return f3(f1() + f2());
}

f4(
    function () { return 2;},
    function () { return 1;},
    function (a) { return a * a; }
);

/* 함수형 프로그래밍:  순수 함수를 조합하고 평가 시점을 정하며 큰 로직을 만들어 가는 것
 함수형 프로그래밍은 애플리케이션, 함수의 구성요소,
 더 나아가서 언어 자체를 함수처럼 여기도록 만들고,
 이러한 함수 개념을 가장 우선순위에 놓는다.

 함수형 사고방식은 문제의 해결방법을
 동사(함수)들로 구성(조합) 하는 것
 * */
