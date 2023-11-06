var divCount = 0;
var selectedArrow = null; // Armazena a seta selecionada
var inputId = null; // Armazena o input de destino selecionado


function getColor(){
    var color = Math.floor(Math.random()*16777215).toString(16);
    return "#"+color;
}

// para criar uma div sem o onclick é so colocar o inputForm como 0
function createDiv(nomeForm, actualName, inputForm, exit) { // Bhaskhara, bhaskara, 3, 2
    divCount++;
    var randomId = 'div' + divCount;
    var mini = 0;
    var ActualDiv = $('<div>').attr('id', randomId).addClass('ActualDiv').attr("actualName", actualName);
    var DraggableDiv = $('<div>').attr('id', 'draggable' + randomId).addClass('DraggableDiv');
    var minimize = $('<div>').addClass('minimize');
    // var svg = $('#svgContainer'); // nao funciona pq jquery não sabe oq os elementos como PATH significam
    {
    var CloseR = $('<div>').addClass('CloseR');
    // CloseR.append(
    //     $('<svg xmlns="http://www.w3.org/2000/svg"'+
    //         'width="16" height="16" fill="black" '+
    //         'class="bi bi-x" viewBox="0 0 16 16" '+
    //         'style="height: 30px; width: 30px; cursor: pointer; color: var(--Black);">')
    //     .append('<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>')
    // );
    
    }

    var raiz = Math.sqrt(2)*2;
    var tstDiv = $('<div>').addClass('tstDiv');
    tstDiv.css("background-color", getColor());
    var ActualResizeHandle = $('<div>').addClass('resize-handle s ui-resizable-s'); // S
    var ActualResizeHandle2 = $('<div>').addClass('resize-handle e ui-resizable-e') // E
    var ActualResizeHandle3 = $('<div>').addClass('resize-handle w ui-resizable-w'); //.css('z-index', '0px'); // W


    var ActualResizeHandle4 = $('<div>').addClass('resize-handle se ui-resizable-se'); // SE
    var ActualResizeHandle5 = $('<div>').addClass('resize-handle sw ui-resizable-sw'); // SW

    {
        // cria o formulario
        var nome = $('<p>').text(nomeForm);
        var form = $('<form>');
        
        var inputElements = [];

        for (let index = 0; index < inputForm; index++) {
            // cria o input
            var input = $('<input>').attr('type', 'text').attr('placeholder', 'Enter text').attr('id', "input"+divCount+index).addClass("teste");
            inputElements.push(input); // Armazena a referência do elemento no array
            input.css("display", "inline-block");
            input.css("height", "2.2rem");
            
            // cria as setas
            var seta = $("<div>").addClass("arrow right").css("position", "absolute").attr('id', "seta"+divCount+index);
            var linha = $('<div>').addClass("linha").css("position", "absolute").attr('id', "linha"+divCount+index); // linha q completa a seta
            linha.css("left", "calc(100% - 60px)");
            linha.css("pointer-events", "none");
            seta.css("left", "calc(100% - 60px)");


            // em ordem: posiçao do index + margin-bottom do index + metade tamanho do index + padding da div mae - metade do tamanho da seta - metade do padding do index
            var valor = String(index)+"*2.2rem + "+String(index)+"*5px + 1.1rem + 60px - "+ raiz +"px - 2.5px";
            seta.css("top", "calc("+valor+")"); // - 2.7px
            linha.css("top", "calc("+valor+" + "+raiz+"px)");

            seta.draggable({
                drag: function() {
                    // A partir da seta, encontre o input associado com base no ID
                    selectedArrow = $(this);
                    arrowId = selectedArrow.attr('id');
                    inputId = $('#' + arrowId.replace('seta', 'input'));
                    
                    // apaga a linha inicial
                    $('#' + arrowId.replace('seta', 'linha')).css("display", "none"); 

                },
                stop: function() {
                    // selectedArrow = null;
                    // inputId = null;
                },
            });

            seta.on('dragstart', function(){
                var highestZIndex = 10;
                $('.ActualDiv').each(function() {
                    var zIndex = parseInt($(this).css('z-index'));
                    if (!isNaN(zIndex) && zIndex > highestZIndex) {
                        highestZIndex = zIndex;
                    }
                });
                $(this).css('z-index', highestZIndex + 1);
            });
            // add ao form
            form.append(input);
            form.append(seta);
            form.append(linha);
        }

        tstDiv.append(form);

        for (let index = 0; index < exit; index++) {
        
            var icon = $('<div>').addClass('icon').html('&#128515;').attr('id', "icon"+divCount+inputForm+index); // Unicode emoji for smiling face 
            icon.css("overflow", "hidden");   

            var seta = $("<div>").addClass("arrow right").css("position", "absolute").attr('id', "seta"+divCount+inputForm+index);
            var linha = $('<div>').addClass("linha").css("position", "absolute").attr('id', "linha"+divCount+inputForm+index); // linha q completa a seta
            linha.css("left", "calc(100% - 60px)");
            linha.css("pointer-events", "none");
            seta.css("left", "calc(100% - 60px)");
            var valor = String(inputForm+index)+"*2.2rem + "+String(inputForm+index)+"*5px + 1.1rem + 60px - "+ raiz +"px - 2.5px";
            seta.css("top", "calc("+valor+")"); // - 2.7px
            linha.css("top", "calc("+valor+" + "+raiz+"px)");
            seta.draggable({
                drag: function() {
                    // A partir da seta, encontre o input associado com base no ID
                    selectedArrow = $(this);
                    arrowId = selectedArrow.attr('id');
                    inputId = $('#' + arrowId.replace('seta', 'icon'));
                    
                    // apaga a linha inicial
                    $('#' + arrowId.replace('seta', 'linha')).css("display", "none"); 

                },
            });

            seta.on('dragstart', function(){
                var highestZIndex = 10;
                $('.ActualDiv').each(function() {
                    var zIndex = parseInt($(this).css('z-index'));
                    if (!isNaN(zIndex) && zIndex > highestZIndex) {
                        highestZIndex = zIndex;
                    }
                });
                $(this).css('z-index', highestZIndex + 1);
            });
            tstDiv.append(icon);
            tstDiv.append(linha);
            tstDiv.append(seta);
        }
        form.on('input', function(event){
            event.preventDefault();
            
            var avaliacao = actualName+"(";
            for (let index = 0; index < inputForm; index++) {
                if (inputElements[index].val() == "") {
                    avaliacao += "0";
                }else{
                    avaliacao += inputElements[index].val();
                }
                if (index < inputForm-1) {
                    avaliacao += ", ";
                }
            }
            avaliacao += ")";

            // var resultado = eval(avaliacao);

            try{
                
                icon.text(eval(avaliacao));

            } catch(e){
                if (e instanceof SyntaxError) {
                    console.log("Erro de sintaxe (esperado)");
                    // Faça algo para lidar com o erro de sintaxe, se necessário
                } else {
                    // Outros tipos de erros que não são de sintaxe
                    console.error("Erro:", e);
                }
            }
        });
        
    }

    $('body').append(ActualDiv);
    $('body').append(DraggableDiv);
    DraggableDiv.append(nome);
    DraggableDiv.append(minimize);
    DraggableDiv.append(CloseR);
    ActualDiv.append(tstDiv);
    ActualDiv.append(ActualResizeHandle);
    ActualDiv.append(ActualResizeHandle2);
    ActualDiv.append(ActualResizeHandle3);

    ActualDiv.append(ActualResizeHandle4);
    ActualDiv.append(ActualResizeHandle5);

    ActualDiv.resizable({
        handles: {
            s: ".s",
            e: ".e",
            w: ".w",
            se: ".se",
            sw: ".sw",
        },
        minHeight: 300,
        minWidth: 300,

        resize: function(event, ui) {
            var actualWidth = ui.size.width;
            var actualHeight = ui.size.height;
            ui.originalLeft = ui.position.left;

            DraggableDiv.css('width', actualWidth);
            DraggableDiv.css('left', ui.originalLeft);
            ActualResizeHandle.css('width', actualWidth);
            ActualResizeHandle2.css('height', actualHeight);
            ActualResizeHandle3.css('height', actualHeight);
            tstDiv.css('width', actualWidth);
            tstDiv.css('height', actualHeight);

            var widthDiff = actualWidth - ui.originalSize.width;

            // for(let index = 0; index < inputForm; index++){
            //     var linha = $("#linha"+divCount+index);
            // var newWidth = parseFloat(linha.css("width")) - widthDiff;
            // linha.css("width", newWidth + "px");
            // }
            
        }
    });

    DraggableDiv.draggable({
        containment: "#container",
        drag: function(event, ui) {
            var offset = ui.offset;
            var left = offset.left;
            var top = offset.top;

            $("#" + randomId).css({
                left: left,
                top: top
            });
        }
    });

    DraggableDiv.on('dragstart', function() {
        // Aumente o z-index da div ao clicar nela
        var highestZIndex = 10;

        // Encontre o maior z-index entre todas as divs visíveis
        $('.ActualDiv').each(function() {
            var zIndex = parseInt($(this).css('z-index'));
            if (!isNaN(zIndex) && zIndex > highestZIndex) {
                highestZIndex = zIndex;
            }
        });

        // Defina o z-index da div atual como o maior z-index + 1
        $(this).css('z-index', highestZIndex + 1);
        ActualDiv.css('z-index', highestZIndex + 1);
    });

    CloseR.on('mousedown', function(){ 

        $("#"+DraggableDiv.attr("id")).remove();
        $("#"+ActualDiv.attr("id")).remove();

    });

    minimize.on('mousedown', function(){
        if(mini == 0){
            ActualDiv.children().hide();
            mini = 1;
        }else{  
            ActualDiv.children().show();
            mini = 0;
            // Aumente o z-index da div ao clicar nela
            var highestZIndex = 10;

            // Encontre o maior z-index entre todas as divs visíveis
            $('.ActualDiv').each(function() {
                var zIndex = parseInt($(this).css('z-index'));
                if (!isNaN(zIndex) && zIndex > highestZIndex) {
                    highestZIndex = zIndex;
                }
            });

            // Defina o z-index da div atual como o maior z-index + 1
            DraggableDiv.css('z-index', highestZIndex + 1);
            ActualDiv.css('z-index', highestZIndex + 1);
        }
    });


    $('input[class="teste"]').droppable({
        accept: '.arrow',
        drop: function() {
            if (String(inputId.attr("id")).includes("icon")) {
                $(this).val(inputId.text()); // caso a seta venha de um div
            } else {
                $(this).val(inputId.val()); // caso a seta venha de um input
            }
            
        }
    });


    // essa parte do código seria responsável por atualizar todas as janelas quando uma atualiza

    // $('input.teste').on('input', function () {
    //     var exemplo = String(this.id).slice(0, -1).replace("input", "div");
    //     var avaliacao = $("#"+exemplo).attr("actualname") + "(";
    //     $("#"+exemplo+" input").each(function(){
    //         if (this.value == "") {
    //             avaliacao += "0";
    //         }else{
    //             avaliacao += this.value;
    //         }
    //         avaliacao += ",";
    //     });
    //     avaliacao = eval(avaliacao.slice(0, -1) + ")");

    //     try{
    //         var ico = String(this.id).slice(0, -1).replace("input", "icon")+"0";
    //         $("#"+ico).text(avaliacao);

    //     } catch(e){
    //         if (e instanceof SyntaxError) {
    //             console.log("Erro de sintaxe (esperado)");
    //             } else {
    //             console.error("Erro:", e);
    //             }
    //     } 
    // });
}

function uploadImg(selectedFile, naturalHeight, naturalWidth){
    if (selectedFile) {

        var ar = 0;

        var randomId = 'div' + divCount++;
        var mini = 0;
        var ActualDiv = $('<div>').attr('id', randomId).addClass('ActualDiv');
        var DraggableDiv = $('<div>').attr('id', 'draggable' + randomId).addClass('DraggableDiv');
        var minimize = $('<div>').addClass('minimize');
        {
        var CloseR = $('<div>').addClass('CloseR');
        }
        var tstDiv = $('<div>').addClass('tstDiv');
        tstDiv.css("padding", "0px");
        tstDiv.css("padding-top", "30px");
        tstDiv.css("background-color", getColor());


        var ActualResizeHandle = $('<div>').addClass('resize-handle s ui-resizable-s'); // S
        var ActualResizeHandle2 = $('<div>').addClass('resize-handle e ui-resizable-e') // E
        var ActualResizeHandle3 = $('<div>').addClass('resize-handle w ui-resizable-w'); //.css('z-index', '0px'); // W
        var ActualResizeHandle4 = $('<div>').addClass('resize-handle se ui-resizable-se'); // SE
        var ActualResizeHandle5 = $('<div>').addClass('resize-handle sw ui-resizable-sw'); // SW

        var imgElement = $("<img>", {
            id: "previewImage",
            src: selectedFile,
            alt: "Imagem selecionada",
            style: "min-width: 290px; min-height: 290px; max-width:100%; max-height:100%; position: relative;"
        });

        if(naturalHeight > naturalWidth){
            ar = naturalHeight/naturalWidth;
            tstDiv.css({
                height:320*ar+"px",
                'min-height': 320*ar+"px",
                'min-width': "320px",
                width: '320px'
            });
            ActualDiv.css({
                height:320*ar+"px",
                'min-height': 320*ar+"px",
                'min-width': "320px",
                width: '320px'
            });
            DraggableDiv.css({
                'min-width': "320px",
                width: '320px'
            });
            ActualResizeHandle.css("min-width", "320px");
            ActualResizeHandle2.css("height", 320*ar+"px");
            ActualResizeHandle3.css("height", 320*ar+"px");
            ActualResizeHandle2.css("min-height", 320*ar+"px");
            ActualResizeHandle3.css("min-height", 320*ar+"px");
            imgElement.css("min-height", 290*ar+"px");
            
        }else{
            ar = naturalWidth/naturalHeight;
            tstDiv.css({
                height:"320px",
                'min-height': "320px",
                'min-width': 290*ar+"px",
                width: 290*ar+"px"
            });
            ActualDiv.css({
                height:"320px",
                'min-height': "320px",
                'min-width': 290*ar+"px",
                width: 290*ar+"px"
            });
            DraggableDiv.css({
                'min-width': 290*ar+"px",
                width: 290*ar+"px"
            });
            ActualResizeHandle.css("width", 290*ar+"px");
            ActualResizeHandle.css("min-width", 290*ar+"px");
            imgElement.css("min-width", 290*ar+"px");
        }


        


        $('body').append(ActualDiv);
        $('body').append(DraggableDiv);
        DraggableDiv.append(minimize);
        DraggableDiv.append(CloseR);
        tstDiv.append(imgElement);
        ActualDiv.append(tstDiv);
        ActualDiv.append(ActualResizeHandle);
        ActualDiv.append(ActualResizeHandle2);
        ActualDiv.append(ActualResizeHandle3);

        ActualDiv.append(ActualResizeHandle4);
        ActualDiv.append(ActualResizeHandle5);

        ActualDiv.resizable({
            handles: {
                s: ".s",
                e: ".e",
                w: ".w",
                se: ".se",
                sw: ".sw",
            },
            minHeight: 50,
            minWidth: 50,
            resize: function(event, ui) {
                var actualWidth = ui.size.width;
                var actualHeight = ui.size.height;
                ui.originalLeft = ui.position.left;

                DraggableDiv.css('width', actualWidth);
                DraggableDiv.css('left', ui.originalLeft);
                ActualResizeHandle.css('width', actualWidth);
                ActualResizeHandle2.css('height', actualHeight);
                ActualResizeHandle3.css('height', actualHeight);
                tstDiv.css('width', actualWidth);
                tstDiv.css('height', actualHeight);
            }
        });

        DraggableDiv.draggable({
            containment: "#container",
            drag: function(event, ui) {
                var offset = ui.offset;
                var left = offset.left;
                var top = offset.top;

                $("#" + randomId).css({
                    left: left,
                    top: top
                });
            }
        });

        DraggableDiv.on('dragstart', function() {
            // Aumente o z-index da div ao clicar nela
            var highestZIndex = 10;

            // Encontre o maior z-index entre todas as divs visíveis
            $('.ActualDiv').each(function() {
                var zIndex = parseInt($(this).css('z-index'));
                if (!isNaN(zIndex) && zIndex > highestZIndex) {
                    highestZIndex = zIndex;
                }
            });

            // Defina o z-index da div atual como o maior z-index + 1
            $(this).css('z-index', highestZIndex + 1);
            ActualDiv.css('z-index', highestZIndex + 1);
        });
        CloseR.on('mousedown', function(){

            $("#"+DraggableDiv.attr("id")).remove();
            $("#"+ActualDiv.attr("id")).remove();

        });

        minimize.on('mousedown', function(){
            if(mini == 0){
                ActualDiv.children().hide();
                mini = 1;
            }else{  
                ActualDiv.children().show();
                mini = 0;
                // Aumente o z-index da div ao clicar nela
                var highestZIndex = 10;

                // Encontre o maior z-index entre todas as divs visíveis
                $('.ActualDiv').each(function() {
                    var zIndex = parseInt($(this).css('z-index'));
                    if (!isNaN(zIndex) && zIndex > highestZIndex) {
                        highestZIndex = zIndex;
                    }
                });

                // Defina o z-index da div atual como o maior z-index + 1
                DraggableDiv.css('z-index', highestZIndex + 1);
                ActualDiv.css('z-index', highestZIndex + 1);
            }
        });

    } else {
        alert('Nenhum arquivo selecionado.');
    }
}