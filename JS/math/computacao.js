var reg = /^0[box]$/i;

function bitShiftZL(x, y){ // msm q multiplicar x por 2
    return  x << y;
}

function bitShiftZR(x, y){ // msm q multiplicar x por 2
    return  x >>> y;
}

function bitShiftSR(x, y){ // dropa o ultimo bit e duplica o bit a esquerda
    return x >> y;
}

function and(x, y){
    return x & y;
}

function or(x, y){
    return x | y;
}

function xor(x, y){
    return x ^ y;
}

function not(x){
    return ~x;
}

function binario(x){
    return x.toString(2);
}

function basePraDecimal(x, base){
    if (reg.test(String(x))) {
        console.log(parseInt(x));
    }    
    return parseInt(x, base);

}

function hexadecimal(x){
    return x.toString(16).toUpperCase();
}

function octal(x){
    return x.toString(8);
}

function base(x, y){
    if (y <= 36 && y > 1 ) {
        return x.toString(y).toUpperCase();
    }else{
        if(y == 1){
            return String(1).repeat(x);
        }else{
            return 0;
        }
    }
    
}