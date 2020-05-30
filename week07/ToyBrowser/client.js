/*
 * @Description: example
 * @Version: 1.0
 * @Autor: slq
 * @Date: 2020-05-13 20:16:53
 * @LastEditors: slq
 * @LastEditTime: 2020-05-30 13:26:14
 */ 
const net =  require("net");
const render = require('./render');
const images = require('images');
const parser = require("./parser.js");
class Request {
    // method, url = host + port + path
    // body: key vaue
    // headers

    constructor(options){
        this.method = options.method || "GET";
        this.host = options.host;
        this.port = options.port || 80; // http协议默认80
        this.path = options.path || "/"; // http协议默认80
        this.body = options.body || {};
        this.headers = options.headers || {};
        if(!this.headers["Content-Type"]){
            this.headers["Content-Type"] = "application/x-www-form-urlencoded"
            // console.log('设置content-type', this.headers["Content-Type"])
        }
        if (this.headers["Content-Type"] === "text/json") {
            this.headers["Content-Type"] = "application/json";
            this.bodyText = JSON.stringify(options.body);
        } else if (this.headers["Content-Type"] === "application/x-www-form-urlencoded") {
            // this.headers["Content-Type"] = "application/json";
            this.bodyText = Object.keys(this.body).map(key => // 配置bodyText文本
                `${key}=${encodeURIComponent(this.body[key])}`
            ).join('&');
            // console.log('this.bodyText', this.bodyText)
            this.headers["Content-Length"] = this.bodyText.length; // 计算content-length
        }
    }
    toString(){
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}
\r
${this.bodyText}`}

    open(method, url){

    }
    send(connection){
        return new Promise((resolve,reject)=> {
            
            if (connection) {
                connection.write(this.toString());
            } else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    connection.write(this.toString());
                })
            }

            connection.on('data', (data) => {
                const parser = new ResponseParser;
                parser.receive(data.toString());
                // resolve(data.toString());
                if(parser.isFinished){
                    resolve(parser.response);
                }
                // console.log(parser.statusLine);
                // console.log(parser.headers);
                connection.end();
            });
            connection.on('error', (err) => {
                reject(err);
                connection.end();
            });
        })

        
    }

}

class Response {

}


class ResponseParser {
    constructor(){
        this.WAITING_STATUS_LINE = 0;
        this.WAITING_STATUS_LINE_END = 1;
        this.WAITING_HEADER_NAME = 2;
        this.WAITING_HEADER_SPACE = 3;
        this.WAITING_HEADER_VALUE = 4;
        this.WAITING_HEADER_LINE_END = 5;
        this.WAITING_HEADER_BLOCK_END = 6;
        this.WAITING_BODY = 7;

        this.currentStatus = this.WAITING_STATUS_LINE
        this.statusLine = "";
        this.headers = {};
        this.headerName = "";
        this.headerValue = "";
        this.bodyParser = null;
    }
    get isFinished(){
        return this.bodyParser && this.bodyParser.isFinished;
    }
    get response() {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers:this.headers,
            body:this.bodyParser.content.join('')
        }
    }
    receive(string){
        let i = 0;
        while(i<string.length){
            this.receiveChar(string.charAt(i));
            i++;
        }
        // for(let i = 0; i< string.length;i++){
        //     this.receiveChar(string.charAt(i));
        // }
    }
    receiveChar(char) {
        // status line
        if (this.currentStatus === this.WAITING_STATUS_LINE){
            // console.log(char.charCodeAt(0));
            if(char === '\r'){
                this.currentStatus = this.WAITING_STATUS_LINE_END;
            } else if (char === '\n') {
                this.currentStatus = this.WAITING_HEADER_NAME;
            } else {
                this.statusLine += (char);
            }
        }
        else if (this.currentStatus === this.WAITING_STATUS_LINE_END) {
            if (char === '\n') {
                this.currentStatus = this.WAITING_HEADER_NAME;
            }
        }
        // header name
        else if (this.currentStatus === this.WAITING_HEADER_NAME) {
            if (char === ':') {
                this.currentStatus = this.WAITING_HEADER_SPACE;
            } else if(char === '\r'){
                this.currentStatus = this.WAITING_HEADER_BLOCK_END; // 结束
                if (this.headers['Transfer-Encoding'] === 'chunked') {
                    this.bodyParser = new TrunkedBodyParser();
                }
                
            } else {
                this.headerName += (char);
            }
        }
        else if (this.currentStatus === this.WAITING_HEADER_SPACE) {
            if (char === ' ') {
                this.currentStatus = this.WAITING_HEADER_VALUE;
            }
        }
        // heade value
        else if (this.currentStatus === this.WAITING_HEADER_VALUE) {
            if (char === '\r') {
                this.currentStatus = this.WAITING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = "";
                this.headerValue = "";
            } else {
                this.headerValue += (char);
            }
        }
        else if (this.currentStatus === this.WAITING_HEADER_LINE_END) {
            if (char === '\n') {
                this.currentStatus = this.WAITING_HEADER_NAME;
            }
        }
        else if (this.currentStatus === this.WAITING_HEADER_BLOCK_END) {
            if (char === '\n') {
                this.currentStatus = this.WAITING_BODY;
            }
        }
        else if (this.currentStatus === this.WAITING_BODY) {
            this.bodyParser.receiveChar(char);
        }
    }
}
class TrunkedBodyParser {
    constructor() {
        this.WAITING_LENGTH = 0;
        this.WAITING_LENGTH_LINE_END = 1;
        this.READING_THUNK = 2;
        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END = 4;
        this.isFinished = false;
        this.length = 0;
        this.content = [];

        this.currentStatus = this.WAITING_LENGTH;
    }
    receiveChar(char) {
        // console.log(JSON.stringify(char));
        if (this.currentStatus === this.WAITING_LENGTH){
            if(char === '\r'){
                if(this.length === 0){

                    this.isFinished = true;
                }
                this.currentStatus = this.WAITING_LENGTH_LINE_END;
            } else {
                this.length *= 16;
                this.length += parseInt(char, 16);
            }
        }
        else if(this.currentStatus === this.WAITING_LENGTH_LINE_END) {
            if (char === '\n') {
                this.currentStatus = this.READING_THUNK;
            }
        }
        else if (this.currentStatus === this.READING_THUNK) {
            this.content.push(char);
            this.length --;
            if(this.length === 0){
               this.currentStatus = this.WAITING_NEW_LINE;
            }
        }
        else if(this.currentStatus === this.WAITING_NEW_LINE) {
            if (char === '\r') {
                this.currentStatus = this.WAITING_NEW_LINE_END;
            }
        }
        else if(this.currentStatus === this.WAITING_NEW_LINE_END) {
            if (char === '\n') {
                this.currentStatus = this.WAITING_LENGTH;
            }
        }
    }
}

void async function () {
    let request = new Request({
        method: "POST",
        host: "127.0.0.1",
        path: "/",
        port: "8088",
        headers: {
            ["X-FOO2"]: "bar"
        },
        body: {
            name: "slq"
        }
    })
    let response = await request.send();
    // console.log('response', response)
    let dom = parser.parserHTML(response.body);
    console.log('dom',dom)
    let viewport = images(800,600);
    // console.log('dom', dom)
    render(viewport,dom);
    viewport.save("viewport.jpg");
    // console.log(dom);
    // console.log(response.body);
}()
 
 /*
const client = net.createConnection({
    host:'127.0.0.1',
    port:8088 }, ()=>{
    console.log('connected to server 连接到服务器');
    
    // 这里要注意 开头不能有空格 ：后面要跟一个空格
   client.write(`
POST / HTTP/1.1\r
Content-Type: application/x-www-form-urlencoded\r
Content-Length: 8\r
\r
name=slq`); 
    let require = new Request({
        method:"POST",
        host:"127.0.0.1",
        path:"/",
        port:"8088",
        headers:{
            ["X-FOO2"]: "bar"
        },
        body:{
            name:"slq"
        }
    })
    console.log(require.toString())
    client.write(require.toString())
});
client.on('data', (data) => {
    console.log(data.toString());
    client.end();
});
client.on('end', () => {
    console.log('已从服务器断开');
});


client.on('error', (err) => {
    console.log(err);
    client.end();
});

*/