<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script> 
    <link rel="shortcut icon" href="#"> 
    <title>Calculadora</title>

    <!-- ADICIONAR SCRIPTS E CSS EM SIDENAVHEAD.HTML, OBRIGADO -->
    <?php
        include("./main/sidenavHead.html");
    ?>



    <!-- ajax pra achar resultado -->
    <!-- <script>
        function resultado(str) {
            if (str.length==0) {
                document.getElementById("pesquisa").innerHTML="";
                document.getElementById("pesquisa").style.border="0px";
                return;
            }
        }
    </script> -->

</head>
<body style="background-color: #f0f0f0;"> <!-- overflow: hidden; -->

    <?php
        include("./main/header.html");
        include("./main/sidenav.html");
    ?>


    <div id="container">
        
    <!-- <a href="https://www.freepik.com/free-photo/old-black-background-grunge-texture-dark-wallpaper-blackboard-chalkboard-room-wall_11712558.htm#query=black%20chalkboard%20background&position=0&from_view=keyword&track=ais">Image by benzoix</a> on Freepik -->
        <!-- Linhas horizontais -->
        <script>
            var tst = 2000;
            for (let i = 0; i <= tst; i++) {
                $('#container').append($('<div>').addClass('linha-horizontal opaque').css('top', i*10 +"px"));
            }
            for (let i = 0; i <= tst; i++) {
                $('#container').append($('<div>').addClass('linha-vertical opaque').css('left', i*10 +"px"));
            }
        </script>

        <!-- <script>
            var tst = 100;
            for (let i = 0; i <= tst; i++) {
                for (let j = 0; j <= 200; j++) {
                    $('#container').append($('<div>').addClass('dot').css('top', i*20 +"px").css('left', j*20 +"px"));
            }
            }
        </script> -->


        <input type="text" id="searchBar" placeholder="Pesquisar..."> <!-- onkeyup="resultado(this.value)" -->
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16" id="lupa" onclick="createDiv('Bhaskara', 'bhaskara', 3)">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
        </svg>

        <div id="pesquisa" class="absolute">
            <ul id="lista" class="absolute"></ul>
        </div>

        <!-- <div style="position: absolute; top: 300px; left: 300px; height: 100px; width: 100px;  background-color: black; z-index: 9999;" onclick="createDiv('Hipotenusa', 'hipotenusa', 2)"></div>
        <div style="position: absolute; top: 300px; left: 400px; height: 100px; width: 100px;  background-color: green; z-index: 9999;" onclick="createDiv('Cateto', 'cateto', 2)"></div>
        <div style="position: absolute; top: 300px; left: 500px; height: 100px; width: 100px;  background-color: red; z-index: 9999;" onclick="createDiv('Perímetro', 'perimetro', 2)"></div>
        <div style="position: absolute; top: 300px; left: 600px; height: 100px; width: 100px;  background-color: blue; z-index: 9999;" onclick="createDiv('Área de retângulo', 'Aretangulo', 2)"></div> -->
        
    </div>

    <?php
        include("./main/footer.html");
    ?>

</body>
</html>