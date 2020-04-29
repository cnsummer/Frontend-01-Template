# 每周总结可以写在这里

## JS中特殊的对象

- [[Call]]  函数对象的定义
- [[Construct]] 构造器对象的定义
- [[Get]] property被访问时调用 get
- [[Set]] property被赋值时调用 set
- [[GetPrototypeOf]] 对应getPrototypeOf方法 获取对象原型
- [[SetPrototypeOf]] 对应setPrototypeOf方法 设置对象原型
- [[GetOwnProperty]] getOwnPropertyDescriptor 获取对象私有属性的描述列表
- [[DefineOwnProperty]]
- [[OwnPropertyKeys]]在 Object.keys , for in 和大部分遍历对象属性的内部方法来获取属性列表
- [[HasProperty]] hasOwnProperty 私有属性判断
- [[IsExtensible]] isExtensible对象是否可扩展
- [[Module]] 视为一个引入的模块
- [[Exports]] 视为一个导出的模块
- [[PreventExtensions]] 对象变的不可扩展，也就是永远不能再添加新的属性

还有一些类似于：
- Array：Array 的 length 属性根据最大的下标自动发生变化。
- Object.prototype：作为所有正常对象的默认原型，不能再给它设置原型了。
- String：为了支持下标运算，String 的正整数属性访问会去字符串里查找。
- Arguments：arguments 的非负整数型下标属性跟对应的变量联动。模块的 namespace 对象：特殊的地方非常多，跟一般对象完全不一样，尽量只用于 import 吧。
- 类型数组和数组缓冲区：跟内存块相关联，下标运算比较特殊。
- bind 后的 function：跟原来的函数相关联。
