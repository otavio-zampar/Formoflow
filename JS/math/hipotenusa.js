function hipotenusa(c1, c2){
        h = Math.sqrt((c1 * c1) + (c2 * c2));
        return h;
}

function cateto(c1, h){
        c2 = Math.sqrt((h * h) - (c1 * c1));
        return c2;
}