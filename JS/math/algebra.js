function fPrimeiro(x, b, c){
    return b * x + c; // -2x + 5 onde x = 1
}

function fSegundo(x, a, b, c){ // X ^ a + X * b + c
    return Math.pow(x, a) + b * x + c; // x³ -2x + 5 onde x = 1
}

function fExponencial(x, a, b, c){ // Log a (X) = Log(x) / Log(a)
    return (Math.log(x)/Math.log(a)) + b * x + c; // Log₃(x) -2x + 5 onde x = 1
}