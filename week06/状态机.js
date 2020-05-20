/*
 * @Description: 
 * @Version: 1.0
 * @Autor: slq
 * @Date: 2020-05-13 09:58:54
 * @LastEditors: slq
 * @LastEditTime: 2020-05-20 21:40:52
 */ 
function match(string){
    let state = start;
    for(let c of string){
        state = state(c)
    }

    return state === end;
}
function start(c){
    if(c === 'a'){
        return foundA;
    } else {
        return start;
    }
}

function end(){
    return end;
}
function foundA(c){
    if(c === 'b'){
        return foundB
    } else {
        return start(c)
    }
}
function foundB(c){
    if(c === 'a'){
        return foundA2;
    } else {
        return start(c)
    }
}
function foundA2(c){
    if(c === 'b'){
        return foundB2;
    } else {
        return start(c)
    }
}
function foundB2(c){
    if(c === 'a'){
        return end;
    } else {
        return start(c)
    }
}
function foundA3(c){
    if(c === 'b'){
        return foundC;
    } else {
        return start(c)
    }
}
function foundC(c){
    if(c === 'x'){
        return end;
    } else {
        return foundB2(c)
    }
}
// abababx
console.log('match',match('abababx'))


/// abc I am a bbcccabc;


function match(pattern,string){
    let state = start;
    for(let c of string){
        state = state(c)
    }

    return state === end;
}

// 模式串 abc 匹配串 acabcabcabd

// 思路 根据模式串生成匹配串需要匹配的代码
 //  下面代码还未结合状态机生成,近期补充
function search(pattern,string){
    let i = 0;
    let j = 0;
    let nxt = next(pattern);
    console.log(nxt)
    while(j < string.length){
        if(pattern[i] === string[j]){
            i++;
            j++;
            console.log(i,j)
        } else {
            j++;
            i = nxt[i];
            console.log(i,j)
        }
        if(i === pattern.length){
            return true
        }
    }
    return false;
}

function next(pattern){
    let i = 1;
    let j = 0;
    let arr = new Array(pattern.length).fill(0) // 创建一个相同长度的数组并补0

    while(i<pattern.length){
        if(pattern[i] !== pattern[j]){
            arr[i] = 0;
            i++;
        } else {
            j++;
            arr[i] = j;
            i++;
        }
    }
    return arr;
}

console.log(search('abcabx','I am a good abcabx'))