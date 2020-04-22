### 作业1 Numeric Literals

我的思路 将下面四种分别写出来然后拼接起来 就能匹配所有的number
```js
/^((\.[0-9]+)|(0|[1-9]+[0-9]*)\.?[0-9]*)([eE][\+\-]?[0-9]+)|(0[bB][01]+)|(0[oO][0-7]+)|(0[xX][0-9a-fA-F]+)$/
```
NumericLiteral ::
        DecimalLiteral (十进制数)
        BinaryIntegerLiteral (二进制)
        OctalIntegerLiteral (八进制)
        HexIntegerLiteral

- 1.先来看DecimalLiteral

DecimalLiteral ::
        DecimalIntegerLiteral . DecimalDigits ExponentPart
        . DecimalDigits ExponentPart
        DecimalIntegerLiteral ExponentPart

可以看出来这个DecimalLiteral可以分为3部分 将这3部分用正则写出来即可达到DecimalLiteral的要求
```js
 /^((\.[0-9]+)|(0|[1-9]+[0-9]*)\.?[0-9]*)([eE][\+\-]?[0-9]+)$/
        // 解释：1.如果以.开头后面必须有1至多位[0-9]的数字
        //       2.0
        //       3.以[1-9]开头后续可以跟0至多位[0-9]的数字
        //       4.如果后面跟.可有可无再匹配0至多位[0-9]的数字
        //       5.最后接e或者E然后+或-或没有符号再匹配1至多位[0-9]的数字
```

DecimalIntegerLiteral ::
        0
        NonZeroDigit DecimalDigits

DecimalDigits ::
        DecimalDigit
        DecimalDigits DecimalDigit

DecimalDigit :: one of
        0 1 2 3 4 5 6 7 8 9

NonZeroDigit :: one of
        1 2 3 4 5 6 7 8 9

ExponentPart ::
        ExponentIndicator SignedInteger

ExponentIndicator :: one of
        e E
        
SignedInteger :: 
        DecimalDigits
        + DecimalDigits
        - DecimalDigits

- 2.BinaryIntegerLiteral

BinaryIntegerLiteral ::
        0b BinaryDigits
        0B BinaryDigits
这部分满足上面两个要求即可
```js
/0[bB][01]+/
```
BinaryDigits ::
        BinaryDigit
        BinaryDigits BinaryDigit
BinaryDigit ::
        0 1
- 3.OctalIntegerLiteral

OctalIntegerLiteral ::
        0o OctalDigits
        0O OctalDigits
这部分满足上面两个要求即可
```js
/0[oO][0-7]+/
```
OctalDigits ::
        OctalDigit
        OctalDigits OctalDigit

OctalDigit :: one of
        0 1 2 3 4 5 6 7

- 4. HexIntegerLiteral
        0x HexDigits
        0X HexDigits

这部分满足上面两个要求即可
```js
/0[xX][0-9a-fA-F]+/
```
HexDigits :: 
        HexDigit
        HexDigits HexDigit

HexDigit :: one of
        0 1 2 3 4 5 6 7 8 9 a b c d e f A B C D E F

