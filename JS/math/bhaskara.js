function bhaskara(a, b, c){
    var delta = (b*b) - (4 * a * c);
    console.log("delta = "+ delta);
    if (delta < 0) {
        return "delta deu negativo, x' e x'' não existem";
    }else{
        var xi = ((-b) + Math.sqrt(delta))/2 * a;
        var xii = ((-b) - Math.sqrt(delta))/2 * a;
        if (delta == 0) {
            //x' = x''

            return [xi, xii];
        }else{
            return [xi, xii];
        }

        //Vértice v = (Xv, Yv) = (-b/2a , -delta/4a )
    }
}