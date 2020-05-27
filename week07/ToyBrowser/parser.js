/*
 * @Description: example
 * @Version: 1.0
 * @Autor: slq
 * @Date: 2020-05-19 20:28:10
 * @LastEditors: slq
 * @LastEditTime: 2020-05-26 23:47:42
 */ 
const css = require("css");
const EOF = Symbol("EOF");

const layout = require('./layout.js');
let currentToken = null;
let currentAttribute = null;

let stack = [{type:"document",children:[]}];
let currentTextNode = null;

let rules = [];

function addCSSRules(test){
    var ast = css.parse(text);
    rules.push(...ast.stylesheet.rules);
}

function match(element,selector){
    if(!selector || !element.attributes){
        return false;
    }
    if(selector.chartAt(0) == "#"){
        var attr = element.attributes.filiter(attr =>{ attr.name === "id"})[0]
        if(attr && attr.value === selector.replace("#", '')){
            return true;
        }

    } else if (selector.chartAt(0) === "."){
        var attr = element.attributes.filiter(attr =>{ attr.name === "class"})[0]
        if(attr && attr.value === selector.replace(".", '')){
            return true;
        }
    } else {
        if(element.tagName === selector){
            return true;
        }
    }
}


function specificity(selector){
    var p = [0, 0, 0, 0];
    var selectorParts = selector.split(" ");
    for(var part of selectorParts){
        if(part.chartAt(0) == "#"){
            p[1] += 1;
        } else if(part.chartAt(0) == "."){
            p[2] += 1;
        } else {
            p[3] += 1;
        }
    }

    return p;

}

function compare(sp1, sp2){
    if(sp1[0] - sp2[0]){
        return sp1[0] - sp2[0];
    }
    if(sp1[1] - sp2[1]){
        return sp1[1] - sp2[1];
    }
    if(sp1[2] - sp2[2]){
        return sp1[2] - sp2[2];
    }

    return sp1[3] - sp2[3];
}

function computeCSS(element){
    var elements = stack.slice().reverse();
    if(!element.computedStyle){
        element.computedStyle = {}
    }

    for(let rule of rules){
        var selectorParts = rule.selectors[0].split(" ").reverse();

        if(!match(element, selectorParts[0])){
            continue;
        }

        var j = 1;
        for(var i = 0; i<elements.length;i++){
            if(match(element, selectorParts[j])){
                j++;
            }
        }

        if(j >=selectorParts.length){
            matched = true;
        }

        if(matched){
            var sp = specificity(rule.selectors[0]);
            var computedStyle = element.computedStyle;

            for(var declaration of rule.declarations){
                if(!computedStyle[declaration.property]){
                    computedStyle[declaration.property] = {}
                }

                if(!computedStyle[declaration.property].specificity){
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                } else if(compare(computedStyle[declaration.property].specificity, sp) < 0){
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                }
            }
        }
    }
}

function emit(token){
    if(token.type != 'text'){
        console.log(token)
    }
    let top = stack[stack.length - 1];

    if(token.type == "startTag"){
        let element = {
            type:"element",
            children:[],
            attributes:[]
        };

        element.tagName = token.tagName;

        for(let p in token){
            if(p != "type" && p != "tagName"){
                element.attributes.push({
                    name:p,
                    value:token[p]
                })
            }
        }
        computeCSS(element);
        layout(element);
        top.children.push(element);

        if (!token.isSelfClosing) {
            stack.push(element)
        }
        // element.parent = top;
        
        currentTextNode = null;

    } else if(token.type == "endTag"){
        // console.log('token', stack)
        if(top.tagName != token.tagName){
            throw new Error("Tag start end doesm't match!");
        } else {
            if(top.tagName === "style"){
                addCSSRules(top.children[0].content)
            }
            stack.pop();
        }
        layout(top);
        currentTextNode = null;
    } else if(token.type == "text") {
        if(currentTextNode == null) {
            currentTextNode = {
                type: "text",
                content:""
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
    
}
function data(c){
    if(c == "<"){
        return tagOpen;
    } else if(c == EOF){
        // 提交
        emit({
            type:"EOF"
        })
        return;
    } else {
        emit({
            type:"text",
            content:c
        })
        return data;
    }
}

function tagOpen(c){
    if(c == "/"){
        return endTagOpen;
    } else if(c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type:"startTag",
            tagName:""
        }
        return tagName(c)
    } else {
        emit({
            type:"text",
            content:c
        });
        return ;
    }
}


function tagName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    } else if(c == "/"){
        return selfClosingStartTag;
    } else if (c.match(/^[A-Z]$/)) { //a-zA-Z
        currentToken.tagName +=c;
        return tagName;
    } else if(c == ">"){
        emit(currentToken)
        return data;
    } else {
        currentToken.tagName += c;
        return tagName;
    }
}
function beforeAttributeName(c){
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if(c == ">" || c == "/" || c == EOF){
        return afterAttributeName(c);
    } else if(c == "="){
        // return ;
    } else {
        currentAttribute = {
            name: "",
            value: "",
        }
        return attributeName(c);
    }
}

function attributeName(c) {
    if(c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF){
        return afterAttributeName(c);
    } else if(c == "="){
        return beforeAttributeValue;
    } else if(c == "\u0000"){

    } else if(c == "\"" || c == "\'" || c == "<") {

    } else {
        currentAttribute.name += c;
        return attributeName;
    }
}
function beforeAttributeValue(c){
    if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
        return beforeAttributeValue;
    } else if (c == "\""){
        return doubleQuotedAttributeValue;
    } else if (c == "\'") {
        return singleQuotedAttributeValue;
    } else if (c == "=") {

    } else {
        return UnquotedAttributeValue(c);
    }
}
function doubleQuotedAttributeValue(c) {
    if (c == '"') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c == "\u0000") {

    } else if (c == EOF) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue
    }
}

function singleQuotedAttributeValue(c){
    if(c == "'"){
         currentToken[currentAttribute.name] = currentAttribute.value;
         return afterQuotedAttributeValue;
    } else if(c == "\u0000"){

    } else if(c == EOF){

    } else {
        currentAttribute.value += c;  // currentAttribute +=c;
        return doubleQuotedAttributeValue
    }
}
function afterQuotedAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c == "/") {
        return selfClosingStartTag;
    } else if (c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c == EOF) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}
function UnquotedAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if(c == "/"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if(c == ">"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if(c == '\u0000'){

    } else if(c == "\"" || c == "\'" || c == "<" || c == "=" || c == "`"){

    } else if( c == EOF){

    } else {
        currentAttribute.value += c;
        return UnquotedAttributeValue;
    }
}
// function selfClosingStartTag(c) {
//     if (c == ">") {
//         currentToken.isSelfclosing = true;
//         console.log(currentToken)
//         emit(currentToken);
//         return data;
//     } else if (c == EOF) {

//     } else {

//     }
// }
function selfClosingStartTag(c) {
    if (c == ">") {
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    } else if (c == "EOF") {} else {}
}
function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "endTag",
            tagName: ""
        }
        return tagName(c)
    } else if (c == ">") {
        // return data;
    } else if (c == EOF) {

    } else {
        // return;
    }
}



function afterAttributeName(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName;
    } else if(c == "/"){
        return selfClosingStartTag;
    } else if(c == "="){
        return beforeAttributeValue;
    } else if(c == ">"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data
    } else if (c == EOF){

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name: "",
            value:""
        }
        return attributeName(c);
    }
}
 module.exports.parserHTML = function parserHTML(html){
    let state = data;
    for(let c of html){
        state = state(c);
    }
    state = state(EOF)
 }