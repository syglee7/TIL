import React, { useState, useReducer } from 'react';
import Table from './Table';

const initialState = {
    winner: '',
    turn: '0',
    tableData: [['','',''],['','',''],['','','']],
};

const reducer = (state, action) => {

};

const TicTacToe = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    /*const [winner, setWinner] = useState('');
    const [turn, setTurn] = useState('0');
    const [tableData, setTableData] = useState([['','',''],['','',''],['','','']]);*/
    return (
        <>
            <Table />
            {state.winner && <div>{state.winner} 님의 승리</div>}
        </>
    );
};
export default TicTacToe;