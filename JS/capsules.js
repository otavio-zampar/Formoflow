var divCount = 0;
var selectedArrowX = selectedArrowY = null;
var inputId = null; // Armazena o input de destino selecionado
var highestZIndex = 11;
var ActualTop = 0;
var leftOffset = 0;
var b = 200;

function findZindex() {
    $('.ActualDiv').each(function() {
        var zIndex = parseInt($(this).css('z-index'));
        if (!isNaN(zIndex) && zIndex > highestZIndex) {
            highestZIndex = zIndex;
        }
    });
}
function getColor(){
    var color = Math.floor(Math.random()*16777215).toString(16);
    var regex = /[0-5]/ig;
    color = color.replace(regex, function(char, index){
        return Math.floor(color[index] * 1.6);
    });
    if(color.length == 5) color = color.concat('f'); 
    return "#"+color;
}

function getGrayColor(){
    var color = Math.floor(Math.random() * 255).toString(16);
    var regex = /[a-f]/ig;
    color = color.replace(regex, function(char, index){
        return Math.floor((color.charCodeAt(index) - 97) * 1.6);
    });
    return "#"+color+color+color;
}

function avaliaJanela(a, c){
    if(c >= 0){
        var inputElements = a.querySelectorAll('input');
        inputForm = inputElements.length;
        var thisDivCount = String(a.parentElement.parentElement.id).replace("div", ""); // form, tstDiv, ActualDiv
        var actualName = $("#div"+thisDivCount).attr("actualname");
        var exit = $("#div"+thisDivCount).attr("exit");
        var avaliacao = actualName+"(";

        for (let index = 0; index < inputForm; index++) {
            if (inputElements[index].value == "") {
                avaliacao += "0";
            }else{
                avaliacao += inputElements[index].value;
            }
            if (index < inputForm-1) {
                avaliacao += ", ";
            }
        }
        avaliacao += ")";

        try{
            var x = [];
            x = String(eval(avaliacao)).split(" "); 
            for (let index = 0; index < exit; index++) {
                if (String(x[index]) == "undefined") {
                    x[index] = "NaN";
                }
                document.getElementById("icon"+thisDivCount+(inputForm+index)).innerHTML = x[index];
            }
        } catch(e){
            if (e instanceof SyntaxError || ReferenceError) {
                console.log("Erro esperado, fórmula não concluída.");
                // Faça algo para lidar com o erro de sintaxe, se necessário
            } else {
                // Outros tipos de erros que não são de sintaxe
                console.error("Erro:", e);
            }
        }
    }
    b--;
}

// para criar uma div sem o onclick é so colocar o inputForm como 0
function createDiv(AA) {    
    var nomeForm = AA.option;
    var actualName = AA.form;
    var inputForm = AA.qnt;
    var exit = AA.exit;
    divCount++;
    ActualTop++;
    var randomId = 'div' + divCount;
    var mini = 0;
    var ActualDiv = $('<div>').attr('id', randomId).addClass('ActualDiv noCopy').attr("actualName", actualName);
    ActualDiv.attr("exit", exit);
    var DraggableDiv = $('<div>').attr('id', 'draggable' + randomId).addClass('DraggableDiv');
    var minimize = $('<div>').addClass('minimize noCopy').html('&#128469');
    var CloseR = $('<div>').addClass('CloseR  noCopy').html('&#10006');

    var tstDiv = $('<div>').addClass('tstDiv');
    const grayC = getGrayColor();
    const colorC = getColor();
    tstDiv.attr("ActualColor", colorC);
    tstDiv.attr("GrayColor", grayC);
    if (dark != 1) { // se for modo dark
        tstDiv.css("background-color", grayC);
    }else{
        tstDiv.css("background-color", colorC);
    }
    
    var ActualResizeHandleS = $('<div>').addClass('resize-handle s ui-resizable-s'); // S
    var ActualResizeHandleE = $('<div>').addClass('resize-handle e ui-resizable-e') // E
    var ActualResizeHandleW = $('<div>').addClass('resize-handle w ui-resizable-w'); //.css('z-index', '0px'); // W


    var ActualResizeHandleSE = $('<div>').addClass('resize-handle se ui-resizable-se'); // SE

    {
        // cria o formulario
        var nome = $('<p>').text(nomeForm).css({
            "margin": "0px",
            "height": "30px",
            "padding": "2px",
            "font-weight": "bold",
            "color": "var(--textColorWindow)"
        }).addClass("noCopy");
        var form = $('<form>');

        for (let index = 0; index < inputForm; index++) {
            // cria o input
            var label = $('<label>').attr({
                "for": "input"+divCount+index,
                "hidden" : ""
            });
            var input = $('<input>').attr('type', 'text').attr('id', "input"+divCount+index).addClass("inputFormula");
            
            if (AA.placeholder[index] != undefined) {
                input.attr("placeholder", AA.placeholder[index]);
                label.empty();
                label.html(AA.placeholder[index]);
            }else{
                input.attr("placeholder", "Digite o texto");
                label.html("Digite o texto");
            }

            input.css("height", "2.2rem");   
            input.css("outline-color", "transparent");
            var valor = "10% + 30px + "+ index +" * (min(2rem, 2vh) + 2.2rem - 1px)";
            input.css("top", "calc("+valor+")");

            input.keydown(function(event) {
                if (event.which === 13) {
                    event.preventDefault();
                }
            });

            // cria as setas
            var seta = $("<div>").addClass("arrow right").attr('id', "seta"+divCount+index).css("position", "absolute");
            var linha = $('<div>').addClass("linha").attr('id', "linha"+divCount+index); // linha q completa a seta

            seta.css("top", "calc("+valor+" - 5px + 1.1rem)");
            linha.css("top", "calc("+valor+" - 2px + 1.1rem)");

            seta.draggable({
                start: function(){
                    selectedArrowX = $(this).css("left");
                    selectedArrowY = $(this).css("top");
                    arrowId = $(this).attr('id');
                    inputId = $('#' + arrowId.replace('seta', 'input'));
                    ActualTop = 1;
                    leftOffset = 0;
                    
                    // apaga a linha inicial
                    $('#' + arrowId.replace('seta', 'linha')).css("display", "none"); 

                    findZindex();
                    highestZIndex += 2;
                    $(this).css('z-index', highestZIndex+200);
                },
                stop: function() {
                    $(this).css({
                        "top": selectedArrowY,
                        "left": selectedArrowX
                    });
                    $('#' + arrowId.replace('seta', 'linha')).css("display", "initial"); 
                },
            });
            // add ao form
            form.append(label);
            form.append(input);
            form.append(seta);
            form.append(linha);

            input.on('input', function(){
                avaliaJanela(this.parentElement, b);
            });
            
            input.on('inputDiferente', function(){
                avaliaJanela(this.parentElement, b);
            });

        }

        tstDiv.append(form);

        for (let index = 0; index < exit; index++) {
        
            var icon = $('<div>').addClass('icon noCopy').attr('id', "icon"+divCount+(inputForm+index)); // Unicode emoji for smiling face 
            icon.css("position", "absolute");
            icon.css("outline-color", "transparent");
            icon.on("click", function(){
                var copyText = document.getElementById("icon"+divCount+(inputForm+index));
                navigator.clipboard.writeText(copyText.innerHTML); // copy to clipboard
                document.getElementById('BTNAlerta').style.display = "initial";
                ActualTop = 1;
                leftOffset = 0;
                setTimeout(() => {
                document.getElementById('BTNAlerta').style.display = "none";
                }, 1000);
            });

            var valor = "10% + 30px + "+ (index+inputForm) +" * (min(2rem, 2vh) + 2.2rem - 1px)";
            icon.css("top", "calc("+valor+")");
            
            
            var seta = $("<div>").addClass("arrow right").attr('id', "seta"+divCount+(inputForm+index)).css("position", "absolute");
            var linha = $('<div>').addClass("linha").attr('id', "linha"+divCount+(inputForm+index)); // linha q completa a seta

            seta.css("top", "calc("+valor+" - 5px + 1.1rem)");
            linha.css("top", "calc("+valor+" - 2px + 1.1rem)");

            
            seta.draggable({
                start: function(){
                    selectedArrowX = $(this).css("left");
                    selectedArrowY = $(this).css("top");
                    arrowId = $(this).attr('id');
                    inputId = $('#' + arrowId.replace('seta', 'icon'));
                    ActualTop = 1;
                    leftOffset = 0;
                    
                    // apaga a linha inicial
                    $('#' + arrowId.replace('seta', 'linha')).css("display", "none"); 

                    findZindex();
                    highestZIndex += 2;
                    $(this).css('z-index', highestZIndex+9999);
                },
                stop: function() {
                    $(this).css({
                        "top": selectedArrowY,
                        "left": selectedArrowX
                    });
                    $('#' + arrowId.replace('seta', 'linha')).css("display", "initial"); 
                },
            });

            tstDiv.append(icon);
            tstDiv.append(linha);
            tstDiv.append(seta);
        }
    }

    $('body').append(ActualDiv);
    $('body').append(DraggableDiv);
    DraggableDiv.append(nome);
    DraggableDiv.append(minimize);
    DraggableDiv.append(CloseR);
    ActualDiv.append(tstDiv);
    ActualDiv.append(ActualResizeHandleS);
    ActualDiv.append(ActualResizeHandleE);
    ActualDiv.append(ActualResizeHandleW);
    ActualDiv.append(ActualResizeHandleSE);

    ActualDiv.resizable({
        handles: {
            s: ".s",
            e: ".e",
            se: ".se",
        },
        minWidth: 300,

        resize: function(event, ui) {
            var actualWidth = ui.size.width;
            var actualHeight = ui.size.height;
            ui.originalLeft = ui.position.left;

            DraggableDiv.css('width', actualWidth);
            DraggableDiv.css('left', ui.originalLeft);
            ActualResizeHandleS.css('width', actualWidth);
            ActualResizeHandleE.css('height', actualHeight);
            ActualResizeHandleW.css('height', actualHeight);
            tstDiv.css('width', actualWidth);
            tstDiv.css('height', actualHeight);
            
            $(".tstDiv > .arrow").each(function () {
                linhaId = this.id.replace("seta", "linha");
                $(this).css({
                    "top": "calc("+$("#"+linhaId).css("top")+" - 3px)",
                    "left": ""
                });
            });
        }
    });
    var minHeight = "calc("+icon.css('top')+" + "+ icon.css('height') +" + 30px)";
    if (ActualTop >= 9) {
        ActualTop = 1;
        leftOffset++;
    }
    ActualDiv.css({
        minHeight: minHeight,
        height:minHeight,
        zIndex: highestZIndex + 1,
        left: "calc(5vw + "+ 50 * ActualTop +"px + "+ 50 * leftOffset +"px)",
        top: "calc(20vh + "+ 50 * ActualTop +"px + "+ 30 * leftOffset +"px)"
    });
    
    tstDiv.css('min-height', minHeight);
    tstDiv.css('height', minHeight);

    if (ActualTop >= 9) {
        ActualTop = 1;
        leftOffset++;
    }
    DraggableDiv.css({
        zIndex: highestZIndex + 1,
        left: "calc(5vw + "+ 50 * ActualTop +"px + "+ 50 * leftOffset +"px)",
        top: "calc(20vh + "+ 50 * ActualTop +"px + "+ 30 * leftOffset +"px)"
    });
    ActualResizeHandleE.css({
        'min-height': minHeight,
        'height': minHeight
    });
    ActualResizeHandleW.css({
        'min-height': minHeight,
        'height': minHeight
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

    CloseR.on('mousedown', function(){ 

        $("#"+DraggableDiv.attr("id")).remove();
        $("#"+ActualDiv.attr("id")).remove();

    });

    minimize.on('mousedown', function(){
        if(mini == 0){
            ActualDiv.css('display', 'none');
            mini = 1;
        }else{  
            ActualDiv.css('display', 'initial');
            mini = 0;
        }
    });


    $('input[class="inputFormula"]').droppable({
        accept: '.arrow',
        drop: function() {
            if (String(inputId.attr("id")).includes("icon")) {
                $(this).val(inputId.text()); // caso a seta venha de um div
                if(inputId.attr("InputPai")){
                    $(this).attr("InputPai", inputId.attr("InputPai"));
                    $(this).css("outline-color", document.getElementById(inputId.attr("InputPai")).parentElement.style.backgroundColor);
                    // console.log(+document.getElementById(inputId.attr("InputPai"))+", "+document.getElementById(inputId.attr("InputPai")).parentElement.style.backgroundColor);
                }else{
                    $(this).attr("InputPai", inputId.attr("id"));
                    $(this).css("outline-color", document.getElementById(inputId.attr("id")).parentElement.style.backgroundColor);
                }
            } else {
                $(this).val(inputId.val()); // caso a seta venha de um input
                if(inputId.attr("InputPai")){
                    $(this).attr("InputPai", inputId.attr("InputPai"));
                    $(this).css("outline-color", document.getElementById(inputId.attr("InputPai")).parentElement.parentElement.style.backgroundColor);
                }else{
                    $(this).attr("InputPai", inputId.attr("id"));
                    $(this).css("outline-color", document.getElementById(inputId.attr("id")).parentElement.parentElement.style.backgroundColor);
                }
            }
            avaliaJanela(this.parentElement, b);
        }
    });


    $('.inputFormula').on('input', function(){
        var mudado = $(this);

        $('.inputFormula').each(function() {
            if (mudado.attr("id") == $(this).attr("InputPai")) {
                $(this).val(mudado.val());
                $(this).trigger('inputDiferente');
            }
        });
    });
    $('.icon').on('DOMSubtreeModified', function(){
        var mudado = this;
        $('.inputFormula').each(function() {
            if (mudado.id == $(this).attr("InputPai")) {
                $(this).val(mudado.innerHTML);
                $(this).trigger('inputDiferente');
            }
        });
    });

    $(document).mousedown(function(e){
        var string = String('#'+randomId+", #draggable"+randomId);
        if ($(string).children().is(e.target)) {
            ActualTop = 1;
            leftOffset = 0;
            findZindex();
            highestZIndex += 2;
            $("#"+randomId).css("z-index", highestZIndex);
            $("#draggable"+randomId).css("z-index", highestZIndex);
        }
    });

}

// exclusivamente para criar diferentes tipos de entrada
function createEntradaDiv(AA) { // Range, range, 1, 1 // Text Area, textarea, 1, 0

    var nomeForm = AA.option;
    var inputInput = AA.form;
    var actualName = AA.type;
    var inputForm = AA.qnt;
    var exit = AA.exit;

    divCount++;
    ActualTop++;
    var randomId = 'div' + divCount;
    var mini = 0;
    var ActualDiv = $('<div>').attr('id', randomId).addClass('ActualDiv noCopy'); // .attr("actualName", actualName)
    ActualDiv.attr("exit", exit);
    var DraggableDiv = $('<div>').attr('id', 'draggable' + randomId).addClass('DraggableDiv');
    var minimize = $('<div>').addClass('minimize').html('&#128469');
    var CloseR = $('<div>').addClass('CloseR').html('&#10006');
    var tstDiv = $('<div>').addClass('tstDiv');
    const grayC = getGrayColor();
    const colorC = getColor();
    tstDiv.attr("ActualColor", colorC);
    tstDiv.attr("GrayColor", grayC);
    if (dark != 1) { // se for modo dark
        tstDiv.css("background-color", grayC);
    }else{
        tstDiv.css("background-color", colorC);
    }
    var ActualResizeHandleS = $('<div>').addClass('resize-handle s ui-resizable-s'); // S
    var ActualResizeHandleE = $('<div>').addClass('resize-handle e ui-resizable-e') // E
    var ActualResizeHandleW = $('<div>').addClass('resize-handle w ui-resizable-w'); // W
    var ActualResizeHandleSE = $('<div>').addClass('resize-handle se ui-resizable-se'); // SE

    {
        // cria o formulario
        var nome = $('<p>').text(nomeForm).css("margin", "0px").addClass("noCopy");
        nome.css("height", "30px");
        nome.css("padding", "2px");
        var form = $('<form>');

        // cria o input
        var label = $('<label>').attr({
            "for": "input"+divCount+1,
            "hidden" : ""
        }).html(nomeForm);
        var input = $('<'+inputInput+'>').attr('type', actualName).attr('id', "input"+divCount+1).attr("min", 0).attr("max", 100).attr("value", 0); // .addClass("inputFormula")
        input.css("position", "absolute");
        input.css("left", "3vh");
        input.css("width", "calc(100% - 6vh)");
        input.css("outline-color", "transparent");
        var valor = "3vh + 30px";
        input.css("top", "calc("+valor+")");
        if (exit == 0) { // somente p textarea
            input.css({
                "height": "calc(100% - (6vh + 30px))",
                "max-height": "calc(100% - (6vh + 30px))",
                "padding": "1rem",
                "font-size": "18px",
                "font-weight": "bold",
                "min-height": "4.4rem"
            });
        }else{
            input.css("height", "2.2rem");   
        }

        // add ao form
        form.append(label);
        form.append(input);
        tstDiv.append(form);

        if(exit != 0){
            var icon = $('<div>').addClass('icon noCopy').attr('id', "icon"+divCount+(inputForm+1)); // Unicode emoji for smiling face 
            icon.css("position", "absolute");
            icon.css("left", "10%");
            icon.css("outline-color", "transparent");
            icon.on("click", function(){
                var copyText = document.getElementById("icon"+divCount+(inputForm+1));
                navigator.clipboard.writeText(copyText.innerHTML); // copy to clipboard
                ActualTop = 1;
                leftOffset = 0;
                document.getElementById('BTNAlerta').style.display = "initial";
                setTimeout(() => {
                document.getElementById('BTNAlerta').style.display = "none";
                }, 1000);
            });

            var valor = "10% + 60px + 2.2rem";
            icon.css("top", "calc("+valor+")");
            
            
            var seta = $("<div>").addClass("arrow right").attr('id', "seta"+divCount+(inputForm+1)).css("position", "absolute");
            var linha = $('<div>').addClass("linha").attr('id', "linha"+divCount+(inputForm+1)); // linha q completa a seta

            seta.css("top", "calc("+valor+" - 5px + 1.1rem)");
            linha.css("top", "calc("+valor+" - 2px + 1.1rem)");

            
            seta.draggable({
                start: function(){
                    // $(this) = $(this);
                    selectedArrowX = $(this).css("left");
                    selectedArrowY = $(this).css("top");
                    arrowId = $(this).attr('id');
                    inputId = $('#' + arrowId.replace('seta', 'icon'));
                    ActualTop = 1;
                    leftOffset = 0;
                    
                    // apaga a linha inicial
                    $('#' + arrowId.replace('seta', 'linha')).css("display", "none"); 

                    findZindex();
                    highestZIndex += 2;
                    $(this).css('z-index', highestZIndex+200);
                },
                stop: function() {
                    $(this).css({
                        "top": selectedArrowY,
                        "left": selectedArrowX
                    });
                    $('#' + arrowId.replace('seta', 'linha')).css("display", "initial"); 
                },
            });

            tstDiv.append(icon);
            tstDiv.append(linha);
            tstDiv.append(seta);

            form.on('input', function(){
                icon.text(input.val());
            });
        
        }
    }

    
    $('body').append(ActualDiv);
    $('body').append(DraggableDiv);
    DraggableDiv.append(nome);
    DraggableDiv.append(minimize);
    DraggableDiv.append(CloseR);
    ActualDiv.append(tstDiv);
    ActualDiv.append(ActualResizeHandleS);
    ActualDiv.append(ActualResizeHandleE);
    ActualDiv.append(ActualResizeHandleW);
    ActualDiv.append(ActualResizeHandleSE);

    ActualDiv.resizable({
        handles: {
            s: ".s",
            e: ".e",
            se: ".se",
        },
        minWidth: 300,

        resize: function(event, ui) {
            var actualWidth = ui.size.width;
            var actualHeight = ui.size.height;
            ui.originalLeft = ui.position.left;

            DraggableDiv.css('width', actualWidth);
            DraggableDiv.css('left', ui.originalLeft);
            ActualResizeHandleS.css('width', actualWidth);
            ActualResizeHandleE.css('height', actualHeight);
            ActualResizeHandleW.css('height', actualHeight);
            tstDiv.css('width', actualWidth);
            tstDiv.css('height', actualHeight);
            input.css("max-height", "calc("+tstDiv.css("height")+" - 20% - 30px)");
            
            $(".tstDiv > .arrow").each(function () {
                linhaId = this.id.replace("seta", "linha");
                $(this).css({
                    "top": "calc("+$("#"+linhaId).css("top")+" - 3px)",
                    "left": ""
                });
            });

        }
    });
    if (exit != 0) {
        var minHeight = "calc("+icon.css('top')+" + "+ icon.css('height') +" + 30px)";    
    }else{
        var minHeight = "calc(20% + 30px)";
    }
    if (ActualTop >= 9) {
        ActualTop = 1;
        leftOffset++;
    }
    ActualDiv.css({
        minHeight: minHeight,
        height: minHeight,
        zIndex: highestZIndex + 1,
        left: "calc(5vw + "+ 50 * ActualTop +"px + "+ 50 * leftOffset +"px)",
        top: "calc(20vh + "+ 50 * ActualTop +"px + "+ 30 * leftOffset +"px)"
    });

    if (exit == 0) {
        var minHeight = "100%";
    }

    tstDiv.css('min-height', minHeight);
    DraggableDiv.css({
        'z-index': highestZIndex + 1,
        left: "calc(5vw + "+ 50 * ActualTop +"px + "+ 50 * leftOffset +"px)",
        top: "calc(20vh + "+ 50 * ActualTop +"px + "+ 30 * leftOffset +"px)"
    });
    ActualResizeHandleE.css({
        'min-height': minHeight,
        'height': minHeight
    });
    ActualResizeHandleW.css({
        'min-height': minHeight,
        'height': minHeight
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

    CloseR.on('mousedown', function(){ 

        $("#"+DraggableDiv.attr("id")).remove();
        $("#"+ActualDiv.attr("id")).remove();

    });

    minimize.on('mousedown', function(){
        if(mini == 0){
            ActualDiv.css('display', 'none');
            mini = 1;
        }else{  
            ActualDiv.css('display', 'initial');
            mini = 0;
        }
    });

    $('input[class="inputFormula"]').droppable({
        accept: '.arrow',
        drop: function() {
            if (String(inputId.attr("id")).includes("icon")) {
                $(this).val(inputId.text()); // caso a seta venha de um div
                if(inputId.attr("InputPai")){
                    $(this).attr("InputPai", inputId.attr("InputPai"));
                    $(this).css("outline-color", document.getElementById(inputId.attr("InputPai")).parentElement.style.backgroundColor);
                }else{
                    $(this).attr("InputPai", inputId.attr("id"));
                    $(this).css("outline-color", document.getElementById(inputId.attr("id")).parentElement.style.backgroundColor);
                }
            } else {
                $(this).val(inputId.val()); // caso a seta venha de um input
                if(inputId.attr("InputPai")){
                    $(this).attr("InputPai", inputId.attr("InputPai"));
                    $(this).css("outline-color", document.getElementById(inputId.attr("InputPai")).parentElement.parentElement.style.backgroundColor);
                }else{
                    $(this).attr("InputPai", inputId.attr("id"));
                    $(this).css("outline-color", document.getElementById(inputId.attr("id")).parentElement.parentElement.style.backgroundColor);
                }
            }
            avaliaJanela(this.parentElement, b);
        }
    });

    $('.inputFormula').on('input', function(){
        var mudado = $(this);
        $('.inputFormula').each(function() {
            if (mudado.attr("id") == $(this).attr("InputPai")) {
                $(this).val(mudado.val());
                $(this).trigger('inputDiferente');
            }
        });
    });

    $('.icon').on('DOMSubtreeModified', function(){
        var mudado = this;
        $('.inputFormula').each(function() {
            if (mudado.id == $(this).attr("InputPai")) {
                $(this).val(mudado.innerHTML);
                $(this).trigger('inputDiferente');
            }
        });
    });

    $(document).mousedown(function(e){
        var string = String('#'+randomId+", #draggable"+randomId);
        if ($(string).children().is(e.target)) {
            findZindex();
            ActualTop = 1;
            leftOffset = 0;
            highestZIndex += 2;
            $("#"+randomId).css("z-index", highestZIndex);
            $("#draggable"+randomId).css("z-index", highestZIndex);
        }
    });
}

function uploadImg(selectedFile, naturalHeight, naturalWidth){
    if (selectedFile) {

        var ar = 0;

        divCount++;
        var randomId = 'div' + divCount;
        var mini = 0;
        var ActualDiv = $('<div>').attr('id', randomId).addClass('ActualDiv noCopy');
        var DraggableDiv = $('<div>').attr('id', 'draggable' + randomId).addClass('DraggableDiv');
        var minimize = $('<div>').addClass('minimize noCopy').html('&#128469');
        {
        var CloseR = $('<div>').addClass('CloseR noCopy').html('&#10006');
        }
        var tstDiv = $('<div>').addClass('tstDiv');
        tstDiv.css("padding", "0px");
        tstDiv.css("padding-top", "30px");
        tstDiv.css("background-color", document.documentElement.style.getPropertyValue("--White")); 
        // basicamente eu estou pegando o valor da propriedade no momento q eu crio a janela, ao invés de pegar a propriedade
        // isso é util pq jogar diretamente como a variável deixaria o texto ilegível ao mudar o tema

        var ActualResizeHandleS = $('<div>').addClass('resize-handle s ui-resizable-s').css('min-width', '290px'); // S
        var ActualResizeHandleE = $('<div>').addClass('resize-handle e ui-resizable-e').css('min-height', '320px'); // E
        var ActualResizeHandleW = $('<div>').addClass('resize-handle w ui-resizable-w').css('min-height', '320px'); // W
        var ActualResizeHandleSE = $('<div>').addClass('resize-handle se ui-resizable-se'); // SE

        var label = $('<label>').attr({
            "for": "previewImage",
            "hidden" : ""
        });
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
            ActualResizeHandleE.css("height", 320*ar+"px");
            ActualResizeHandleW.css("height", 320*ar+"px");
            // ActualResizeHandleE.css("min-height", 320*ar+"px");
            // ActualResizeHandleW.css("min-height", 320*ar+"px");
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
            ActualResizeHandleS.css("width", 290*ar+"px");
            imgElement.css("min-width", 290*ar+"px");
        }
        


        $('body').append(ActualDiv);
        $('body').append(DraggableDiv);
        DraggableDiv.append(minimize);
        DraggableDiv.append(CloseR);
        tstDiv.append(label);
        tstDiv.append(imgElement);
        ActualDiv.append(tstDiv);
        ActualDiv.append(ActualResizeHandleS);
        ActualDiv.append(ActualResizeHandleE);
        ActualDiv.append(ActualResizeHandleW);

        ActualDiv.append(ActualResizeHandleSE);

        ActualDiv.resizable({
            handles: {
                s: ".s",
                e: ".e",
                se: ".se",
            },
            minHeight: 50,
            minWidth: 50,
            resize: function(event, ui) {
                var actualWidth = ui.size.width;
                var actualHeight = ui.size.height;
                ui.originalLeft = ui.position.left;

                DraggableDiv.css('width', actualWidth);
                DraggableDiv.css('left', ui.originalLeft);
                ActualResizeHandleS.css('width', actualWidth);
                ActualResizeHandleE.css('height', actualHeight);
                ActualResizeHandleW.css('height', actualHeight);
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
            }
        });

    } else {
        alert('Nenhum arquivo selecionado.');
    }
}

window.addEventListener('resize', function(){
    $(".tstDiv > .arrow").each(function () {
        linhaId = this.id.replace("seta", "linha");
        $(this).css({
            "top": "calc("+$("#"+linhaId).css("top")+" - 3px)",
            "left": ""
        });
    });
});

$(document).mousedown(function (){
    b = 200; // ACABA A PORCARIA DO BUG GRAÇADEUS
});

$(document).on("input", function (){
    b = 200;
});