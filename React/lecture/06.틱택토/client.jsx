const React = require('react');
const ReactDom = require('react-dom');
const { hot } = require('react-hot-loader/root');

const TicTacToe = require('./TicTacToe');

const Hot = hot(TicTacToe);

ReactDom.render(<Hot />, document.querySelector('#root'));