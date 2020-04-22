### 作业2 UTF-8 Encoding

思路：将字符串分别获取Unicode 16进制编码与UTf-8的四个区间做对比，然后转化成 2进制根据UTF-8的存储公式生成 再转化为16进制 最终就是编码格式了

```js
function UTF8Encoding(str){
    let arr = []
    let retStr = ''
    for(let i =0;i<str.length;i++){
        arr.push(a[i].codePointAt())
    }
        arr.forEach(element =>{
            retStr = retStr + encoding(element)
        })
        return retStr
        // 比较区间
        function compare(code){
        let code = '0x' + code.toString(16)
        let i = 'first'
        if(0x0080 <= code <=0x07FF){
            i = 'second'
        }
        if(0x0800 <= code <=0xFFFE){
            i = 'three'
        }
        if(0x10000 <= code <=0x1FFFFF){
            i = 'four'
        }
        return i
    }
            function encoding(code){
            let retbinary = ''
            let binary = code.toString(2) // 获得二进制
            let region = compare(code) // 获得区间
            if(region == 'first'){
                retbinary =('0'+binary.slice(binary.length-7)).toString(16)
            } else if(region == 'second'){
                let fihead = `0000${binary.slice(0,-6)}`
                    retbinary = ('110'+fihead.substr(-5) + '10'+binary.slice(binary.length-6)).toString(16)
            } else if(region == 'three'){
                 let fihead = `0000${binary.slice(0,-12)}`
                    retbinary = ('1110'+fihead.substr(-4) + '10'+binary.slice(binary.length-12,binary.length-7) + '10'+binary.slice(binary.length-6)).toString(16)
            } else if(region == 'four'){
                let fihead = `0000${binary.slice(0,-18)}`
                    retbinary = ('11110'+fihead.substr(-3) + '10'+binary.slice(binary.length-18,binary.length-13) + '10'+binary.slice(binary.length-12,binary.length-7) + '10'+binary.slice(binary.length-6)).toString(16)
            }

             return retbinary
        }
}

```