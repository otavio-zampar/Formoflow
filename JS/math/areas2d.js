var area = 0;

function Aretangulo(base, h){
    //esta formula também funciona com quadrados
    area = base * h;
    return area;
}

function Acirculo(raio){
    area = Math.PI * raio * raio;
    return area;
}

function Atriangulo(base, h){
    area = (base * h)/2;
    return area;
}

function AtrianguloEquilatero(lado){
    area = ((lado * lado) * Math.sqrt(3)) / 4;
    return area;
}

function Atrapezio(Base, base, h){
    area = ((Base + base) * h)/2;
    return area;
}

function Alosango(Diagonal, diagonal){
    area = (Diagonal * diagonal) / 2;
    return area;
}

function AanguloTriangulo(lad1, lad2, ang){
    area = (lad1 * lad2 * Math.sin(ang))/2;
    return area;
}