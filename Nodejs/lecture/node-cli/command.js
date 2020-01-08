#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');

const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Template</title>
</head>
<body>
  <h1>Hello</h1>
  <p>CLI</p>
</body>
</html>`;

const routerTemplate = `const express = require('express');
const router = express.Router();
 
router.get('/', (req, res, next) => {
   try {
     res.send('ok');
   } catch (error) {
     console.error(error);
     next(error);
   }
});
 
module.exports = router;`;

const exist = (dir) => {
    try {
        fs.accessSync(dir, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
        return true;
    } catch (e) {
        return false;
    }
};

const mkdirp = (dir) => {
    const dirname = path
        .relative('.', path.normalize(dir))
        .split(path.sep)
        .filter(p => !!p);
    dirname.forEach((d, idx) => {
        const pathBuilder = dirname.slice(0, idx + 1).join(path.sep);
        if (!exist(pathBuilder)) {
            fs.mkdirSync(pathBuilder);
        }
    });
};


const makeTemplate = (type, name, directory) => {
    mkdirp(directory);
    if (type === 'html') {
        const pathToFile = path.join(directory, `${name}.html`);
        if (exist(pathToFile)) {
            console.error(chalk.bold.red('이미 해당 파일이 존재 합니다'));
        } else {
            fs.writeFileSync(pathToFile, htmlTemplate);
            console.log(pathToFile, '생성 완료');
        }
    } else if (type === 'express-router') {
        const pathToFile = path.join(directory, `${name}.js`);
        if (exist(pathToFile)) {
            console.error('이미 해당 파일이 존재 합니다');
        } else {
            fs.writeFileSync(pathToFile, routerTemplate);
            console.log(pathToFile, '생성 완료');
        }
    } else {
        console.error('html 또는 express-router 중 하나 입력');
    }
};

let triggered = false;

program
    .version('0.0.1', '-v, --version')
    .usage('[options]');

program
    .command('template <type>') // <> 로 되어 있는건 필수
    .usage('--name <name> --path [path]') // [] 는 옵션
    .description('템플릿을 생성합니다')
    .alias('tmpl')
    .option('-n, --name <name>', '파일명을 입력하세요', 'index') // 제일 앞에 있는 인자는 alias
    .option('-d, --directory [path]', '생성 경로를 입력하세요', '.')
    .action((type, options) => {
       // 실제로 실행되는 부분
       makeTemplate(type, options.name, options.directory);
       triggered = true; // 동작을 했으면 inquired 가 필요 없음
    });

program
    .command('*', {noHelp : true})
    .action(() => {
        console.log('해당 명령어를 찾을 수 없습니다.');
        program.help();
    });

program
    .parse(process.argv);

if (!triggered) {
    /*
    type : 프롬프트 종류
    name : 질문명
    message : 메세지
    choices : 선택지
    default : 기본값
     */
    inquirer.prompt([{
        type: 'list',
        name: 'type',
        message: '템플릿 종류를 선택하세요',
        choices : ['html', 'express-router'],
    }, {
        type: 'input',
        name: 'name',
        message: '파일의 이름을 입력하세요',
        default: 'index',
    },{
        type: 'input',
        name: 'directory',
        message: '파일이 위치할 폴더의 경로를 입력하세요.',
        default : '.',

    }, {
        type: 'confirm',
        name: 'confirm',
        message: '생성 하시겠습니까?'
    }])
        .then((answers) => {
            if (answers.confirm) {
                makeTemplate(answers.type, answers.name, answers.directory);
            }
        })
}