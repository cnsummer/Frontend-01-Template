### 作业3 String Literal

String Literal ::
        " DoubleStringCharacters "
        ' SingleStringCharacters '

DoubleStringCharacters ::
        DoubleStringCharacter DoubleStringCharacters

SingleStringCharacters ::
        SingleStringCharacter SingleStringCharacters

DoubleStringCharacter ::
        SourceCharacter but not one of " or \ or LineTerminator (所有的Uncode码点 不能是一个" 或 \ or LineTerminator) (LineTerminator(换行符)指的是<LF><CR><LS><PS>)
        <LS> (LINE SEPARATOR \u2028)
        <PS> (PARAGRAPH SEPARATOR  \u2029)
        \ EscapeSequence
        LineContinuation
---
分为四个部分

SourceCharacter but not one of " or \ or LineTerminator 可以翻译为
```js
/[^"\\\n\r\u2028\u2029]/
```
<LS> (LINE SEPARATOR \u2028) 可翻译为
```
\u2028
```

<PS> (PARAGRAPH SEPARATOR  \u2029) 可翻译为
```
\u2029
```

\ EscapeSequence 可翻译为(这个部分差u { CodePoint } 这里有些没搞懂)
```js
/\\(['"\\bfnrtv]|[^'"\\bfnrtv0-9xu\n\r\u2028\u2029]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/
```

最终可以翻译为
```js
/[^"\\\n\r\u2028\u2029]|\u2028|\u2029|\\(['"\\bfnrtv]|[^'"\\bfnrtv0-9xu\n\r\u2028\u2029]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})|(0[0-9]+)|\\[\r\n\u2028\u2029]/
```

SingleStringCharacter ::
        SourceCharacter but not one of " or \ or LineTerminator
        <LS>
        <PS>
        \ EscapeSequence
        LineContinuation

LineContinuation ::
        \ LineTerminatorSequence

EscapeSequence ::
        CharacterEscapeSequence
        0 [lookahead ∉ DecimalDigit] (/0[0-9]+/)
        HexEscapeSequence (/x[0-9a-fA-F]{2}/)
        UnicodeEscapeSequence (/u[0-9a-fA-F]{4}/)

CharacterEscapeSequence ::
        SingleEscapeCharacter (/['"\\bfnrtv]/)
        NonEscapeCharacter (/[^'"\\bfnrtv0-9xu\n\r\u2028\u2029])

SingleEscapeCharacter :: one of
        ' " \ b f n r t v

NonEscapeCharacter ::
        SourceCharacter but not one of EscapeCharacter or LineTerminator

EscapeCharacter ::
        SingleEscapeCharacter (/['"\\bfnrtv]/)
        DecimalDigit (/[0-9]/)
        x
        u

HexEscapeSequence ::
        x HexDigit HexDigit

UnicodeEscapeSequence ::
        u Hex4Digits (/u[0-9a-fA-F]{4}/)
        u { CodePoint } (这个模拟不出来)
 
Hex4Digits ::
        HexDigit HexDigit HexDigit HexDigit

CodePoint ::
        HexDigits but only if MV of HexDigits <= 0x10FFFF
