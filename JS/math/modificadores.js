function soma(a, b) {
    return a + b;
}

function subtracao(a, b) {
    return a - b;
}

function multiplicacao(a, b) {
    return a * b;
}

function divisao(a, b) {
    return a / b;
}

function raizQ(a, b) {
    return Math.pow(a, 1/b);
}

function aleatorio(a, b) {
    a = Math.ceil(a);
    b = Math.floor(b);
    return Math.floor(Math.random() * (b - a + 1)) + a;
}



function modulo(a) {
    if (a < 0) {
        return a*-1;
    }else{
        return a;
    }
}
