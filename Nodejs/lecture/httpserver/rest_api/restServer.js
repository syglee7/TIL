const http = require('http');
const fs = require('fs');

const users = {

};
http.createServer((req, res) => {
    if (req.method === 'GET') {
        if (req.url === '/') {
            return fs.readFile('./restFront.html', (err, data) => {
                if (err) {
                  throw err;
                }
                res.end(data);
            });
        } else if (req.url ==='/users') {
            return res.end(JSON.stringify(users));
        }
        return fs.readFile(`.${req.url}`, (err, data) => {
            return res.end(data);
        });

    } else if (req.method === 'POST') {
        if (req.url === '/') {

        } else if (req.url ==='/users') {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            return req.on('end', () => {
                console.log('POST 본문(body)', body);
                const { name } = JSON.parse(body);
                const id = +new Date();
                users[id] = name;
                res.writeHead(201, {'Content-Type' : 'text/html; charset=utf-8'});
                res.end('사용자 등록 성공');
            });
        }
    } else if (req.method === 'PATCH') {
        if (req.url === '/') {

        } else if (req.url ==='/users') {

        }
    } else if (req.method === 'PUT') {
        if (req.url === '/') {

        } else if (req.url.startsWith('/users/')) {
            const id = req.url.split('/')[2];
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });

            return req.on('end', () => {
                console.log('put', body);
                users[id] = JSON.parse(body).name;
                return res.end(JSON.stringify(users));
            })
        }
    } else if (req.method === 'DELETE') {
        if (req.url === '/') {

        } else if (req.url.startsWith('/users/')) {
            const id = req.url.split('/')[2];
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });

            return req.on('end', () => {
                console.log('delete', body);
                delete users[id];
                return res.end(JSON.stringify(users));
            })
        }
    }
}).listen(8085, () => {
   console.log('8085번 포트에서 서버 대기중');
});