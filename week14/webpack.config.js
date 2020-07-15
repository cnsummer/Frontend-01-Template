/*
 * @Description: example
 * @Version: 1.0
 * @Autor: slq
 * @Date: 2020-07-09 20:16:50
 * @LastEditors: slq
 * @LastEditTime: 2020-07-09 20:49:10
 */ 
const path = require("path");


module.exports = {
    entry:'./main.js',
    module:{
        rules:[
            {
                test:/\.js$/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:['@babel/preset-env'],
                        plugins: [
                            ['@babel/plugin-transform-react-jsx', {
                                pragma: "create"
                            }]
                        ]
                    }
                }
            }
        ]
    },
    mode:"development",
    optimization:{
        minimize:false
    }
}