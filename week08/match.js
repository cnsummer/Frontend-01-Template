/*
 * @Description: example
 * @Version: 1.0
 * @Autor: slq
 * @Date: 2020-06-03 21:26:46
 * @LastEditors: slq
 * @LastEditTime: 2020-06-03 23:24:59
 */ 




function matchClassSelector(element, selector){
    return element.className.split(/\s+/g).includes(selector.replace('.', ''))

}

function  matchTypeSelector(element, selector){
    return element.tagName === selector.toUpperCase()
}

function matchIdSelector(element, selector){
    return element.id === selector.replace('#','')
}
const attrValueCompareFuns = { // 属性选择器处理
    // https://developer.mozilla.org/zh-CN/docs/Web/CSS/Attribute_selectors
    '=': (attrValue, value) => attrValue === value,
    '~=': (attrValue, value) => attrValue.split(' ').includes(value),
    '|=value': (attrValue, value) => attrValue === value || attrValue.startsWith(`${value}-`),
    '^=': (attrValue, value) => attrValue.startsWith(`${value}`),
    '$=': (attrValue, value) => attrValue.endsWith(`${value}`),
    '*=': (attrValue, value) => attrValue.includes(`${value}`),
}

function matchAttributeSelector(element, selector) { // 属性选择器处理
    // let selector = '[attr]'  ["[attr = value]", "attr", "=", "value", index: 0, input: "[attr = value]", groups: undefined]
    const match  = /^\[\s*([\w-]+)\s*(?:(=)\s*(\S+))?\s*\]$/.exec(selector)
    // console.log(match)
    if(!match) {
        return false
    };
    const name = match(1);
    const attrValue = element.getAttribute(name);
    if(attrValue == null){ // 判断属性名
        return false;
    }
    const comparator = match(2)
    if(!comparator){ // 判断 = 
        return true;
    }
    const value = match[3].replace(/["']/g, '') // 去除 ' "
    return attrValueCompareFuns[comparator](attrValue, value);
}
function matchSimpleSelector(element, selector){
    if(!selector || !element){
        return false;
    } else if (selector.chartAt(0) === '.') { // 这部分是class
        return matchClassSelector(element, selector)
    } else if(selector.chartAt(0) === '#'){ // id
        return matchIdSelector(element, selector)
    } else if(selector.match(/^\[(.+?)\]$/)){
        return matchAttributeSelector(element, selector)
    } else {
        return matchTypeSelector(element, selector)
    }
}

// 复合选择器可以拆成简单选择器数组进行比对
function matchBySimpleSelectorSequence(simpleSelectorSequence, element){
    if(!simpleSelectorSequence || !element){
        return false;
    }
    // let simpleSelectorSequence = `a#id.link[src^='https']`
    const simpleSelectors = simpleSelectorSequence.split(/(?<=[\w\]])(?=[#.\[])/)
    return simpleSelectors.every( simpleSelector =>{
        matchSimpleSelector(simpleSelector, element)
    })
}
