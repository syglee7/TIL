const React = require('react');
const Ball = require('./Ball');
const { useState, useRef, useEffect, useMemo, useCallback } = React;

function getWinNumbers() {
    console.log('getwinnumbers');
    const candidate = Array(45).fill().map((v,i) => i + 1);
    const shuffle = [];
    while (candidate.length > 0) {
        shuffle.push(candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]);
    }

    const bonusNumber = shuffle[shuffle.length - 1];
    const winNumbers = shuffle.splice(0,6).sort((p,c) => p - c);
    return [...winNumbers, bonusNumber];
}

const Lotto = () => {
    const lottoNumbers = useMemo(() => getWinNumbers(), []);
    const [winNumbers, setWinNumbers] = useState(lottoNumbers);
    const [winBalls, setWinBalls] = useState([]);
    const [bonus, setBonus] = useState(null);
    const [redo, setRedo] = useState(false);
    const timeouts = useRef([]);

    useEffect(() => {
        for (let i = 0; i < winNumbers.length - 1; i++) {
            timeouts.current[i] = setTimeout(() => {

                setWinBalls(prevBalls => [...prevBalls, winNumbers[i]]);

            }, (i + 1) * 1000);
        }

        timeouts.current[6] = setTimeout(() => {
            setBonus(winNumbers[6]);
            setRedo(true);

        },7000);

        return () => {
            timeouts.current.forEach((v) => {
                clearTimeout(v); //componentWillUnmount
            })
        };
    }, [timeouts.current]); // 빈 배열이면 componentDidMount 와 동일
    // 배열의 요서가 있으면 componentDidMount 랑 componentDidUpdate 수행

    const onClickRedo = useCallback(() => {
        setWinNumbers(getWinNumbers());
        setWinBalls([]);
        setBonus(null);
        setRedo(false);
        timeouts.current = [];
    },[winNumbers]);

    return (
        <>
            <div>당첨 숫자</div>
            <div id="결과창">
                {winBalls.map((v) => <Ball key={v} number={v} />)}
            </div>
            <div>보너스!</div>
            {bonus && <Ball number={bonus} />}
            {redo && <button onClick={onClickRedo}>한 번 더!</button>}
        </>
    );
};

  

module.exports = Lotto;