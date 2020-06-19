/*
 * @Description: example
 * @Version: 1.0
 * @Autor: slq
 * @Date: 2020-05-26 23:48:00
 * @LastEditors: slq
 * @LastEditTime: 2020-05-30 13:25:00
 */ 
const images = require('images');

function render(viewport, element){
    if(element.style){
        console.log('render',element)
        let img = images(element.style.width, element.style.height);

        if(element.style["background-color"]){
            let color = element.style["background-color"] || "rgb(0,0,0)";
            color.match(/rgb\((\d+),(\d+),(\d+)\)/);
            img.fill(Number(RegExp.$1),Number(RegExp.$2),Number(RegExp.$3), 1);
            viewport.draw(img, element.style.left || 0, element.style.top || 0);
        }
    }

    if(element.children){
        for(let child of element.children) {
            render(viewport,child);
        }
    }
}

module.exports = render;