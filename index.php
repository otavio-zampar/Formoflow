<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="#"> 
    <title>Calculadora</title>

    <!-- ADICIONAR SCRIPTS E CSS EM SIDENAVHEAD.HTML, OBRIGADO -->
    <?php
        include("./main/sidenavHead.html");
    ?>

</head>
<body style="background-color: #f0f0f0;"> <!-- overflow: hidden; -->

    <?php
        include("./main/header.html");
        include("./main/sidenav.html");
    ?>


    <div id="container">
        
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

        <input type="text" id="searchBar" placeholder="Pesquisar...">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16" id="lupa" onclick="createDiv('Bhaskara', 'bhaskara', 3)">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
        </svg>

        <div id="pesquisa" class="absolute">
            <ul id="lista" class="absolute"></ul>
        </div>
        
    </div>

    <?php
        include("./main/footer.html");
    ?>

</body>
</html>