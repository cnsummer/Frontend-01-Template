# 第三课

编程语言通识

### 按照语法分类

非形式语言 
    中文、英文
形式语言 乔姆斯基谱系

- 0型 无限制文法
- 1型 上下文相关文法
- 2型 上下文无关文法
- 3型 正则文法

几种流行的语言折中处理 用词法跟语法综合这几种文法

产生式(BNF)巴斯克诺尔范式

- 用尖括号括起来的名称来表示语法结构名
- 语法结果分成基础基础结构和需要用气气他语法结果定义的复合结果
   - 基础结果称终结符
   - 复合结构称非终结符
- 引号和中间的字符表示终结符
- 可以有括号
- *表示重复多次
- |表示或
- +表示至少1次

<Number> = "0" | "1" | .... | "9"

<DecimalNumber> = "0" | (("1" | ...... | "9") <Number> *) ==> <DecimalNumber> = /0|[1-9][0-9]*/

<PrimaryExpression> = <DecimalNumber> |
    "(" <LogicalExpression> ")"

<MultiplicativeExpression> = <PrimaryExpression> | 
    <MultiplicativeExpression> "*" <DecimalNumber> |
    <MultiplicativeExpression> "/" <DecimalNumber>

=><AdditiveExpression> = <MultiplicativeExpression> | 
    <AdditiveExpression> "+" <MultiplicativeExpression> |
    <AdditiveExpression> "-" <MultiplicativeExpression>

<LogicalExpression> = <AdditiveExpression> |
    <LogicalExpression> "||" <AdditiveExpression> |
    <LogicalExpression> "&&" <AdditiveExpression>

解析这个过程叫语法分析 （放到代码仓库里）
0型 无限制文法
(等号左边以及等号右边可以有多个非终结符)
"a" <b> "c" ::= "a" "x" "c"  
1型 上下文相关文法
(等号左边以及等号右边可以有多个非终结符,但是只能变中间的那个)
"a" <b> "c" ::= "a" "x" "c"

例子：
"```四则运算" <LogicalExpression> "```" ::= "```四则运算" <<AdditiveExpression> |
    <LogicalExpression> "||" <AdditiveExpression> |
    <LogicalExpression> "&&" <AdditiveExpression>> "```"


2型 上下文无关文法
等号的左边只能有一个非终结符
<A>::=?
3型 正则文法
只允许左递归
<A> ::= <A> ?
<A> ::= ? <A> 不对  

--- 用正则文法写四则运算

用正则表达式检索是叫词法分析 

JS表达式部分是正则文法

练习 计算机语言分类


图灵完备性

- 图灵完备性
  - 命令式--图灵机
    - goto
    - if和while
  - 声明式--lambda
    - 递归
动态与静态

动态
 - 在用户的设备/在线服务器上
 - 产品实际运行时
 - Runtime
静态
 - 在程序员的设备上
 - 产品开发时
 - Compiletime

类型系统
- 动态类型系统与静态类型系统
- 强类型与弱类型
    - String + Number
    - String == Boolean
- 复合类型
  - 结构体
  - 函数签名
- 子类型
  - 逆变/协变 

一般命令式编程语言

ATOM(原子)
 - Identifier
 - Literal

Expression(表达式)
 - Atom
 - Operator
 - Punctuator

Statement
 - Expression
 - Keyword
 - Punctuator

Structure
 - Function
 - Class
 - Process
 - Namespace
 - ...

Program
 - Program
 - Module
 - Package
 - Library
