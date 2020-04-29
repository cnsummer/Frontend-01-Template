function convertNumberToString(number, x){
    let integer = Math.floor(number);
    let fraction = number - integer;
    let string = '';
    while(integer > 0){
        string = integer % x + string;
        integer = Math.floor(integer / x);
    }
    return fraction ? `${string}.${fraction}` : string;
}