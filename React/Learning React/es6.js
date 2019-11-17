const oneSecond = () => 1000;
const getCurrentTime = () => new Date();
const clear =  () => console.clear();
const log = message => console.log(message);

// Date 객체를 받아서 시,분,초가 들어있는 24시간제 시각을 반환한다.
const abstractClockTime = date => ({
   hours: date.getHours(),
   minutes: date.getMinutes(),
   seconds: date.getSeconds()
});

// 24시간제 시각을 받아서 상용시 시각으로 변환한다.
const civilianHours = clockTime => ({
    ...clockTime,
    hours: (clockTime.hours > 12) ? clockTime.hours - 12 : clockTime.hours
});

// 24시간제 시각을 받아서 시각에 맞는 AM이나 PM을 붙여준다.
const appendAMPM = clockTime => ({
    ...clockTime,
    ampm: (clockTime.hours >= 12) ? "PM" : "AM"
});

// 대상 함수를 인자로 받아서 그 함수에 시각을 전달하는 함수를 반환한다. 이 예제에서 대상함수는 console.log
const display = target => time => target(time);

// 탬플릿 문자열을 받아서 그 문자열이 지정하는 형식대로 시각을 표현하는 문자열을 반환한다.
const formatClock = format =>
    time =>
        format.replace("hh", time.hours)
            .replace("mm", time.minutes)
            .replace("ss", time.seconds)
            .replace("tt", time.ampm);

// 키와 객체를 인자로 받아서 객체에서 그 키에 해당하는 프로퍼티 값이 9 이하인 경우 앞에 0을 붙인 문자열을 반환하고 10 이상인 경우 그냥 반환
const prependZero = key => clockTime => ({
    ...clockTime,
    [key]: (clockTime[key] < 10) ? "0" + clockTime[key] : clockTime[key]
});

// 이제까지는 시계를 움직이기 위해 필요한 함수를 만든고거 이제 이 함수들을 합성해야 한다. compose 함수 사용
const compose = (...fns) =>
    (arg) =>
        fns.reduce(
            (composed, f) => f(composed),
            arg
        );

// 24시간제 시각을 받아서 상용시로 변환하는 함수다.
const convertToCivilianTime = clockTime =>
    compose(
        appendAMPM,
        civilianHours
    )(clockTime);

//  상용시 객체를 받아서 시,분,초가 두 자리 숫자로 이루어졌는지 확인하고 필요하면 앞에 0을 붙임
const doubleDigits = civilianTime =>
    compose(
        prependZero("Hours"),
        prependZero("minutes"),
        prependZero("seconds")
    )(civilianTime);

// 매초 호출되는 인터벌 타이머를 설정해서 시계를 시작한다. 타이머의 콜백은 위에서 만든 여러 함수를 합성한 함수다.
const startTicking = () =>
    setInterval(
        compose(
            clear,
            getCurrentTime,
            abstractClockTime,
            convertToCivilianTime,
            doubleDigits,
            formatClock("hh:mm:ss tt"),
            display(log)
        ),
        oneSecond()
    );


startTicking();