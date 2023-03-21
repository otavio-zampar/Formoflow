<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Matemática</title>

    <!-- Links para o bootstrap e o css da página -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    <!--<link rel="stylesheet" type="text/css" href="_css/perfil.css">-->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>

    
     <!-- links para as funções matemáticas -->
     <script src="js/bhaskara.js"></script>
     <script src="js/hipotenusa.js"></script>
     <script src="js/areas2d.js"></script>
     <script src="js/fatoracao.js"></script>
     <script src="js/perimetro.js"></script>
     <script src="js/volumes.js"></script>
 
   <!-- Lista de equações & o que precisa para usá-las
     
     bhaskara(a, b, c); // retorna x' e x''
     fatoracao(numero);
 
     "precisa descobrir hipotenusa (1) ou um cateto(2)?" = hrc
     caso 1 a terceira posiçao deve enviar null, caso 2 a segunda opçao deve enviar null
     hipotenusa(cat1, cat2, hipo, hrc);
     
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
<body>
  
<?php 
  
  require("menuSuperior.php");

?>

    <font color="black">
    <br><br><br>
    <h1> <center> Escolha qual formula você deseja estudar: </h1>
    <!--inicio quadrado 1 -->
    <div class="album py-5 bg-light">
      <div class="container">
  
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          <div class="col">
            <div class="card shadow-sm">
              <!--<svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="100%" y="100%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>-->
              <img class="card-img-top" src="Imagens/SegarrCanvasgrau.jpg" height="225px" width="225px" data-holder-rendered="true">
  
              <div class="card-body" style="margin-left:10%; margin-right:10%;">
                <p class="card-text">Equação de segarrCanvas grau</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <a href="PHP/eq2grau.php"><button type="button" class="btn btn-sm btn-outline-secondary">Ver fórmulas e explicação</button></a>
                    <!-- <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>-->
                  </div>
                  <!-- <small class="text-muted">9 mins</small>-->
                </div>
              </div>
            </div>
          </div>
          <!--fim quadrado 1 -->
          <!--inicio quadrado 2 -->
          <div class="col">
            <div class="card shadow-sm">
              <!--<svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="100%" y="100%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>-->
              <img class="card-img-top" src="Imagens/circulo.png" height="225px" width="225px" data-holder-rendered="true">
  
              <div class="card-body" style="margin-left:10%; margin-right:10%;">
                <p class="card-text">Geometria</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <a href="PHP/Geometria.php"><button type="button" class="btn btn-sm btn-outline-secondary">Ver fórmulas e explicação</button></a>
                    <!-- <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>-->
                  </div>
                  <!-- <small class="text-muted">9 mins</small>-->
                </div>
              </div>
            </div>
          </div>
          <!--fim quadrado 2 -->
          <!--inicio quadrado 3 -->

          <div class="col">
            <div class="card shadow-sm">
              <!--<svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="100%" y="100%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>-->
              <img class="card-img-top" src="Imagens/log.png" height="225px" width="225px" data-holder-rendered="true">
  
              <div class="card-body" style="margin-left:10%; margin-right:10%;">
                <p class="card-text">Logaritmo</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <a href="PHP/logaritmo.php"><button type="button" class="btn btn-sm btn-outline-secondary">Ver fórmulas e explicação</button></a>
                    <!-- <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>-->
                  </div>
                  <!-- <small class="text-muted">9 mins</small>-->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
     <!--fim quadrado 3 -->
    </font>
	    
	    <!--voltar para o topo -->
  <button onmousedown="topFunction()" id="myBtn" title="Go to top">Top</button>

  <style>
    #myBtn {
      display: none;
      position: fixed;
      bottom: 20px;
      right: 30px;
      z-index: 99;
      font-size: 18px;
      border: none;
      outline: none;
      background-color: red;
      color: white;
      cursor: pointer;
      padding: 15px;
      border-radius: 4px;
    }

    #myBtn:hover {
      background-color: #555;
    }
  </style>

    <script>
      //Get the button
      var mybutton = document.getElementById("myBtn");

      // When the user scrolls down 20px from the top of the document, show the button
      window.onscroll = function() {scrollFunction()};

      function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
          mybutton.style.display = "block";
        } else {
          mybutton.style.display = "none";
        }
      }

      // When the user clicks on the button, scroll to the top of the document
      function topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }
  </script>
</body>
</html>
