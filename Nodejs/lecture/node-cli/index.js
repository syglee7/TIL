#!/usr/bin/env node
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.clear();
const answerCallback = (answer) => {
    if (answer === 'y' || answer === 'Y') {
        console.log('thank you');
        rl.close();
    } else if (answer === 'n' || answer === 'N') {
        console.log('get out');
        rl.close();
    } else {
        console.clear();
        console.log('just typing y or n');
        rl.question('예제 유잼?(Y/N)', answerCallback);
    }
};

rl.question('예제 유잼? Y/N', answerCallback);

