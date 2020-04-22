### 第四课 JavaScript

##### Unicode
范围最广的字符集
for(let i = 0;i<128;i++){
    console.log(String.fromCharCode(i))
}

#### ATOM

InputElement

    WhiteSpace:: // 空格 前五种空格

    <TAB>('\t'制表符) 
    <VT>('\v'纵向制表符) 
    <FF>(FORM FEED 换页) 
    <SP> (SPACE) 
    <NBSP>(&nbsp;\u00A0(160) NO_BREAK_SPACE) 
    <ZWNBSP>   (\uFEFF ZERO_WIDTH_NO_BREAK_SPACE)
    <USP>


    LineTerminator :: // 换行符

    <LF> LINE FEED  \n \u0010 U+000A
    <CR> CARRIAGE RETURN \r \u000D  U+000D
    <LS> LINE SEPARATOR \u2028
    <PS> PARAGRAPH SEPARATOR  \u2029


    Comment // 注释 单行注释以及多行注释

    Token ::
        
        Punctuator // 
        IdentifierName // 标识符 let a a就是标识符
                KeyWords 变量名部分 (不呢能够包含关键字)
                Indentifier 属性部分 (能跟关键字)
                            Start
                            Part
                Future reserved KeyWords 将来可能会用的关键字
        Literal // 字面意义的
                Number // IEEE 754 Double Float
                    Sign(1) 符号位
                    Exponent(11) 科学计数法
                    Fraction(52) 精度部分

                    Number Grammer 语法
                     DecimalLiteral
                            0
                            0.1
                            .2
                            1e3  
                     BinaryIntegerLiteral
                            0b11
                     OctallntegerLiterAl
                            0o10
                     HexIntegerLiteral
                            0xFF
                    (写一个正则表达式 匹配所有的number 作业)
                    
                String
                    Character 字符
                    Code Point 码点
                    Encoding 
                    
                    String Grammar
                    "abc"
                    'abc'
                    `abc`

                Boolean
                Null
                Undefined
                
                Object
                



// 空格是分很多种的 