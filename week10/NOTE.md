<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: slq
 * @Date: 2020-06-19 15:51:26
 * @LastEditors: slq
 * @LastEditTime: 2020-06-19 15:52:27
--> 
### Range Api

```js
var range = new Range()
range.setStart(element, 9)
range.setEnd(element, 4)
var range = document.getSelection().getRangeAt(0)
range.setStartBefore
range.setEndBefore
range.setStartAfter
range.setEndAfter
range.selectNode
range.selectNodeContents
var fragment = range.extractContents()
range.insertNode(document.createTextNode('aaa'))
document.styleSheets
document.styleSheets
```
### 案例

```js
Rules
document.styleSheets[0].cssRules
document.styleSheets[0].insertRule('p{color: pink}', 0)
document.styleSheets[0].removeRule(0)
getComputedStyld
window
view
element.getClientRects()
element.getBoundingClientRect()
```

### 所有API
- data:text/html,xxxxx
- data:text/css,p%7Bcolor:blue%7D
- data:image/svg+xml,xxxxx
- data:image/svg+xml;base64,xxxxx
..