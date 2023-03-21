var volume = 0;
function Vcubo(lad){
    volume = lad * lad * lad;
    return volume;
}

function Vparalelepipedo(larg, comp, h){
    volume = larg * comp * h;
    return volume;
}

function Vcilindro(raio, h){
    volume = Math.PI * (raio * raio) * h;
    return volume;
}

function Vesfera(raio){
    volume = (4 * Math.PI * (raio * raio * raio)) / 3;
    return volume;
}

function Vcone(raio, h){
    volume = (Math.PI * (raio * raio) * h) / 3;
    return volume;
}

function Vprisma(A, h){
    volume = A * h;
    return volume;
}