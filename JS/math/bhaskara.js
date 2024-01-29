function bhaskara(a, b, c){ // 1, 3, -4 = [1, -4]
    var delta = (b*b) - (4 * a * c);
    if (delta < 0) {
        return ["NaN", "NaN"];
    }else{
        var x = [];
        x[0] = ((-b) + Math.sqrt(delta))/2 * a;
        x[1] = ((-b) - Math.sqrt(delta))/2 * a;

        return x;
    }
}


