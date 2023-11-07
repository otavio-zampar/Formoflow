<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="#"> 
    <title>Formoflow: Esboços Matemáticos Dinâmicos</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script> 

    <!--Link bootstrap, jquery & CSS-->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">

    <link rel="stylesheet" type="text/css" href="css/main.css">
    <link rel="stylesheet" type="text/css" href="css/sidenav.css">
    <link rel="stylesheet" type="text/css" href="css/index.css">
    <link rel="stylesheet" type="text/css" href="css/capsules.css">
    <link rel="stylesheet" type="text/css" href="css/pesquisa.css">


    <!-- links para a sidenav & fatoracao-->
    <script src="./js/mudaTema.js"></script>
    <script src="./js/sidenav.js"></script>
    <script src="./js/calculadora.js"></script>
    <script src="./js/desenho.js"></script>
    <script src="./js/math/fatoracao.js"></script>
    <script src="./js/math/bhaskara.js"></script>
    <script src="./js/math/areas2d.js"></script>
    <script src="./js/math/hipotenusa.js"></script>
    <script src="./js/math/perimetro.js"></script>
    <script src="./js/math/volumes.js"></script>
    <script src="./js/math/modificadores.js"></script>

    <!-- coisa das janelas/capsulas -->
    <script src="./js/capsules.js"></script>
    <script src="./js/pesquisa.js"></script>
    <script src="./js/data.js"></script>
    <script src="./js/background.js"></script>


    <!-- coisa da calculadora -->
    <script lang="JavaScript">  

        //usada na calculadora pra nao dar erro na pontuaçao (i) e na operaçao (f)
        var i = 0;
        var f = 0;

        //usado para alternar entre abrir e fechar os menus laterais
        var openCal = 0;
        var openDra = 0;
        var openExt = 0;
        var MathDeg = '(Math.PI/180)*';
        var sin = 'Sin(';
        var cos = 'Cos(';
        var tan = 'Tan(';
        var log = 'Log(';
    </script>

    <script>
        var isSet = false;
        var dark = false;
        mudaTema(dark);
        dark = !dark; // falso = tema claro; verdadeiro = tema escuro;
    </script>

    <script>
        $(document).ready(function() {
            $('#whereHeader').load("./main/header.html");
            $('#whereSidenavC').load("./main/sidenavCalculadora.html");
            $('#whereSidenavU').load("./main/sidenavUpload.html");
        });
        
    </script>

</head>
<body style="background-color: var(--AlmostWhite); overflow-y: hidden;"> <!-- overflow: hidden; -->

    <div id="whereHeader"></div>
    <div id="whereSidenavC"></div>
    <div id="whereSidenavU"></div>

    <!-- basicamente eu tive que incluir a sidenav de desenho no index pq o JS depende do canvas criado aqui, 
    e o JS estava sendo chamado primeiro -->
    <div id="whereSidenavD">
        <div class="rounded-pill base pill" id="btnMyDraw" style="top: calc(45vh + 5rem); background-color: var(--AccentColor);" onmousedown='openDraw()'>
            <svg xmlns="https://www.w3.org/2000/svg" id="btnDraw" width="16" height="16" fill="var(--BaseColor)" class="bi bi-chevron-compact-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223z"/>
            </svg>
        </div>
        <div id="myDraw" class="sidenavDraw base" style="z-index: 9995; height: 100vh; max-height: 100vh; width: 70%; left: -70%; border-top-right-radius: 25px; border-bottom-right-radius: 25px; overflow-y: hidden;">
            <!-- menu para configuraçoes da caneta -->
            <!-- div de canetas de desenho -->
            <div class="shadow" id="caneta">
                <!-- div eraser -->
                <div>
                    <!-- empty -->
                    <svg id="eraserMT" xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="basic_instruments bi bi-eraser eraser" viewBox="0 0 16 16" style="z-index:7;" onmousedown="{
                        document.getElementById('eraserMT').style.opacity = '0';
                        document.getElementById('eraserFull').style.opacity = '1';
                        document.getElementById('eraserFull').style.zIndex = '7';
                        document.getElementById('eraserMT').style.zIndex = '6';

                        document.getElementById('penMT').style.opacity = '1';
                        document.getElementById('penFull').style.opacity = '0';
                        document.getElementById('penFull').style.zIndex = '6';
                        document.getElementById('penMT').style.zIndex = '7';
                    }">
                        <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414l-3.879-3.879zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z"/>
                    </svg>
                    <!-- full -->
                    <svg id="eraserFull" xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="basic_instruments bi bi-eraser-fill eraser" viewBox="0 0 16 16" style="z-index:6; opacity: 0;" onmousedown="{
                        document.getElementById('eraserMT').style.opacity = '1';
                        document.getElementById('eraserFull').style.opacity = '0';
                        document.getElementById('eraserFull').style.zIndex = '6';
                        document.getElementById('eraserMT').style.zIndex = '7';
                    }">
                        <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z"/>
                    </svg>
                </div>
                
                <!-- div pen -->
                <div>
                    <!-- empty -->
                    <svg id="penMT" xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="basic_instruments bi bi-pen pen" viewBox="0 0 16 16" style="z-index:7;" onmousedown="{
                        document.getElementById('penMT').style.opacity = '0';
                        document.getElementById('penFull').style.opacity = '1';
                        document.getElementById('penFull').style.zIndex = '7';
                        document.getElementById('penMT').style.zIndex = '6';

                        document.getElementById('eraserMT').style.opacity = '1';
                        document.getElementById('eraserFull').style.opacity = '0';
                        document.getElementById('eraserFull').style.zIndex = '6';
                        document.getElementById('eraserMT').style.zIndex = '7';
                    }">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/> 
                    </svg>
                    <!-- full -->
                    <svg id="penFull" xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="basic_instruments bi bi-pen-fill pen" viewBox="0 0 16 16" style="z-index:6; opacity: 0;" onmousedown="{
                        document.getElementById('penMT').style.opacity = '1';
                        document.getElementById('penFull').style.opacity = '0';
                        document.getElementById('penFull').style.zIndex = '6';
                        document.getElementById('penMT').style.zIndex = '7';
                    }">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z"/>
                    </svg>
                </div>

                <div style="width: 13vw; height: 100px; right: 1vw; top:45vh; position: absolute; padding-left: 1vw;">
                    <!-- width -->
                    <input type="range" id="sizeRange" min="1" max="140" value="5" oninput="changeSize(this.value); document.getElementById('sizeText').value = myCanvas.getContext('2d').lineWidth;">
                    <input type="text" id="sizeText" value="5" autocomplete="false" onkeydown="return TriggeredKey(this);" onkeyup="myCanvas.getContext('2d').lineWidth = this.value;">
                    
                    <button onmousedown="increaseSize(true);" class="BTNIncrease">
                        <svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="var(--Black)" class="bi bi-chevron-up" viewBox="0 0 16 16" style="height:2.5vh; width: 2.5vh; transform: rotate(360deg); position: absolute; top: 0vh; left: 0.625vw;">
                            <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                        </svg>
                    </button>
                    
                    <button style="top: 8.5vh;" onmousedown="increaseSize(false)" class="BTNIncrease">
                        <svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="var(--Black)" class="bi bi-chevron-up" viewBox="0 0 16 16" style="height: 2.5vh; width: 2.5vh; transform: rotate(180deg); position: absolute; top: 0vh; left: 0.625vw;">
                            <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                        </svg>
                    </button>
                
                    <!-- color -->
                    <input id="ColPck" type="color"/>
                </div>

                <div style="width: 12vw; right: 1vw; bottom: 3vh; position: absolute;">
                    <!-- undo -->
                    <!-- <button style="margin: 0px;" onclick="und();">kinda Undo</button> -->
            
                    <!-- redo -->
                    <!-- <button style="margin: 0px;" onclick="red();">kinda Redo</button> -->
                    
                    <!-- save -->
                    <button style="margin: 0px; width: 10vh;" onclick="{
                    // perguntar se quer fundo transparente
                        download_img();
                    }">Save</button>
                    <!-- mandar para a area de trabalho -->
                    <button style="margin: 0px;" onclick="{
                        // perguntar se quer fundo transparente
                        send_img();
                    }">Mandar para a àrea de Trabalho</button>
                </div>

            </div>

            <!-- confirm('Limpar a tela?'); -->
            <svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="var(--BaseColor)" class="bi bi-x" viewBox="0 0 16 16" style="height: 2.5rem; width:2.5rem; top: 5vh; right: 0.5vw; cursor: pointer; float: right; position: absolute;" onmousedown="clearCanvas();"> 
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>

            <!-- aqui é realmente a area de desenhar -->
            <div style="height:90vh; width: 50vw; left: 16vw;  top: 5vh; border-radius: 15px; position: absolute;">
                <canvas id="myCanvas" class="shadow" onload="">
                    Sorry, your browser doesn't support canvas technology.
                </canvas>
                <div id="mouseFollower"></div>
            </div>
        </div>
    </div>

    <div id="container">
        <!-- Linhas horizontais -->
        <script>
            criaBckgnd(200);
        </script>

        <!-- <svg id="svgContainer" width="100vw" height="100vh">
            <line x1="0" y1="0" x2="200" y2="200" style="stroke:rgb(255,0,0);stroke-width:2" />
        </svg> -->

        <input type="text" id="searchBar" placeholder="Pesquisar...">
        <!-- when clicking, the fisrt result should be selected -->
        <svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16" id="lupa" onclick="{

            const query = $('#searchBar').val().toLowerCase().trim();
            const filteredResults = data.filter(item => item.option.toLowerCase().includes(query));
            if (filteredResults.length > 0) {
                createDiv(filteredResults[0].option, filteredResults[0].form, filteredResults[0].qnt, filteredResults[0].exit);
            }
        }">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
        </svg>

        <div id="pesquisa">
            <ul id="lista" class="absolute" style="overflow:auto;"></ul>
        </div>
        
    </div>

    <div id="whereFooter">
        <div id="contato">
            <p>Otavio custódio Zampar</p>
            <p class="contato">CONTATO</p>
            <p class="contato">AAA</p>
            <p class="contato">tavicozampar@gmail.com</p>
            <p class="contato">otavio.zampar@fatec.sp.gov.br</p>
            <div>
            <a href="" target="_blank" rel="noopener"><img src=""></a>
            <!-- <a href="https://www.twitter.com/tavicozampar" target="_blank" rel="noopener"><img src="../src/TwitterLogoBlue.svg" style="height: auto; width: 25px;"></a>
            <a href="https://www.linkedin.com/in/ot%C3%A1vio-cust%C3%B3dio-zampar-0907561bb" target="_blank" rel="noopener"><img src="../src/LI-In-Bug.png" style="height: auto; width: 25px;"></a> -->
            <a href="" target="_blank" rel="noopener"><img src=""></a>
            </div>
            <p style="width:400px;" class="contato">© Otavio Zampar</p>
            <br>

            <!--Bootstrap JS-->
            <!-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script> -->
        </div>
    </div>

</body>
</html>