/*
 * @Description: example
 * @Version: 1.0
 * @Autor: slq
 * @Date: 2020-05-13 19:57:30
 * @LastEditors: slq
 * @LastEditTime: 2020-05-20 00:25:55
 */ 
const http = require("http");

const server = http.createServer((req,res)=>{
    console.log("resquest received");
    console.log(req.headers);
    res.setHeader('Content-Type','text/html');
    res.setHeader('X-FOO','bar');
    res.writeHead(200,{ 'Content-Type': 'text/plain' });
    res.end(
`
<html maaa=a >
<head>
    <style>
body div #myid{
    width:100px;
    background-color: #ff5000;
}
body div img{
    width:30px;
    background-color: #ff1111;
}
    </style>
</head>
<body>
    <div>
        <img id="myid"/>
        <img />
    </div>
</body>
</html>`
    );
})

server.listen(8088);