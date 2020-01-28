const React = require('react');
const { useState, useRef } = React;

const ResponseCheck = () => {
    const [state, setState] = useState('waiting');
    const [message, setMessage] = useState('click to START');
    const [result, setResult] = useState([]);
    const timeOut = useRef(null);
    const startTime = useRef(0);
    const endTime = useRef(0);

    const onClickScreen = () => {

        if (state === 'waiting') {
            setState('ready');
            setMessage('초록색이 되면 클릭하세요');

            timeOut.current = setTimeout(() => {
                setState('now');
                setMessage('지금 클릭!!!');

                startTime.current = new Date();
            }, Math.floor(Math.random() * 1000) + 2000);
        } else if (state === 'ready') {
            clearTimeout(timeout.current);
            setState('waiting');
            setMessage('초록색이 된 후에 클릭하셔야 합니다.');

        } else if (state === 'now') {
            endTime.current = new Date();

            setState('waiting');
            setMessage('클릭해서 시작하세요');
            setResult((prevState) => {
                return [...prevState, endTime.current - startTime.current];
            });

        }
    };

    const onReset = () => {
        setResult([]);
    };

    const renderAverage = () => {

        return result.length === 0 ? null :
            <>
                <div>평균 시간: {result.reduce((a, c) => a + c) / result.length} ms</div>
                <button onClick={onReset}>리셋</button>
            </>
    };

    return (
        <>
            <div
                id="screen"
                className={state}
                onClick={onClickScreen}>
                {message}
            </div>
            {renderAverage()}
        </>
    );
};

module.exports = ResponseCheck;