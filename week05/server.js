/*
 * @Description: example
 * @Version: 1.0
 * @Autor: slq
 * @Date: 2020-05-13 19:57:30
 * @LastEditors: slq
 * @LastEditTime: 2020-05-17 20:22:46
 */ 
const http = require("http");

const server = http.createServer((req,res)=>{
    console.log("resquest received");
    console.log(req.headers);
    res.setHeader('Content-Type','text/html');
    res.setHeader('X-FOO','bar');
    res.writeHead(200,{ 'Content-Type': 'text/plain' });
    res.end('ok');
})

server.listen(8088);