<!DOCTYPE html>
<html lang="pt_br">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Matemática</title>
    
    <?php
        include("./main/sidenavHead.html");
    ?>

    <!-- links para as funções matemáticas & sidenav-->
    <script src="./js/math/bhaskara.js"></script>
    <script src="./js/math/hipotenusa.js"></script>
    <script src="./js/math/areas2d.js"></script>
    <script src="./js/math/fatoracao.js"></script>
    <script src="./js/math/perimetro.js"></script>
    <script src="./js/math/volumes.js"></script>
    

    <!-- Lista de equações & o que precisa para usá-las
    
    bhaskara(a, b, c); // retorna x' e x''
    fatoracao(numero);

    hipotenusa(cat1, cat2);
    cateto(cat1, hipo);


    A = area
    Aretangulo(base, altura);
    Acirculo(raio);
    Atriangulo(base, altura);
    AtrianguloEquilatero(lado);
    Atrapezio(Base, base, altura);
    Alosango(Diagonal, diagonal);
    AanguloTriangulo(lado 1, lado 2, angulo);
    
    perimetro(lado, tamanho); // quantidade de lados e o tamanho do lados
    "já sabe o perímetro? 1 - sim |2 - nao" pra calcular o perimetro precisa de perimetro, lado, tamanho
    ApoiligonoRegular(perimetro, a); // a é a reta que cruza a mediana do lado e o centro do poligono

    V = volume
    Vcubo(lado);
    Vparalelepipedo(largura, comprimento, altura);
    Vcilindro(raio, altura);
    Vesfera(raio);
    Vcone(raio, altura);

    "ja sabe a area da base? 1 - sim | 2 - nao"
    Vprisma(area, altura); //onde area é a area da base
   -->
</head>
<body style="background-color: #f0f0f0; overflow-x: hidden;">
    <?php
        include("./main/header.html");
        include("./main/sidenav.html");
    ?>


    <!-- add stuff here -->


    <?php
        include("./main/footer.html");
    ?>
</body>
</html>