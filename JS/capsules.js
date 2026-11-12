var divCount = 0;
var selectedArrowX = selectedArrowY = null;
var inputId = null; // Armazena o input de destino selecionado
var highestZIndex = 11;
var ActualTop = 0;
var leftOffset = 0;
var counter = 200;
var profundidadeMaximaPropagacao = 50;

// Centraliza o aviso inferior para que uma mensagem antiga (por exemplo, o
// envio de um desenho) nunca apareça no lugar do "Copiado!" de um card.
function textoCopiado() {
    if (typeof linguagem !== 'undefined') {
        if (linguagem === 'EN-US') {
            return 'Copied!';
        }

        if (linguagem === 'SP-MX') {
            return '¡Copiado!';
        }
    }

    return 'Copiado!';
}

function mostrarAlertaGlobal(mensagem, duracao) {
    var alerta = document.getElementById('BTNAlerta');

    if (!alerta || !alerta.firstElementChild) {
        return;
    }

    alerta.firstElementChild.innerHTML = mensagem;
    alerta.style.display = 'initial';
    window.clearTimeout(window.__alertaGlobalTimer);

    window.__alertaGlobalTimer = window.setTimeout(function () {
        alerta.style.display = 'none';
    }, duracao || 1600);
}

// Recalcula uma cápsula a partir de um input (função) ou atualiza a saída de
// uma cápsula de entrada (range).
function avaliarEntrada(entrada, visitados, profundidade) {
    var janela = $(entrada).closest('.ActualDiv');

    if (janela.length == 0) {
        return;
    }

    if (janela.attr('actualname')) {
        avaliaJanela(entrada.parentElement, counter, visitados, profundidade);
    } else {
        $(entrada.parentElement).trigger('input');
    }
}

// Propaga o valor de um input ou de um ícone de saída para todas as caixas
// que foram ligadas a ele. A propagação é recursiva, então uma alteração na
// subtração também recalcula a multiplicação que usa o resultado dela.
function propagarValor(origem, valor, visitados, profundidade) {
    if (!origem || !origem.id || valor === undefined || valor === null) {
        return;
    }

    visitados = visitados || {};
    profundidade = profundidade || 0;

    if (profundidade > profundidadeMaximaPropagacao) {
        return;
    }

    var texto = String(valor);
    var chave = origem.id + '=' + texto;

    // evita loops caso o usuário liga uma caixa na outra
    if (visitados[chave]) {
        return;
    }
    visitados[chave] = true;

    $('.inputFormula').each(function () {
        if ($(this).attr('InputPai') !== origem.id) {
            return;
        }

        var entrada = this;

        // se o valor não mudou, a cápsula filha já está atualizada
        if (entrada.value === texto) {
            return;
        }

        entrada.value = texto;
        avaliarEntrada(entrada, visitados, profundidade + 1);
        propagarValor(entrada, entrada.value, visitados, profundidade + 1);
    });
}

function desvincularInputDoPai(entrada) {
    if (!entrada) {
        return;
    }

    if (entrada.getAttribute && entrada.getAttribute('InputPai')) {
        entrada.removeAttribute('InputPai');
    }

    if ($(entrada).attr('InputPai')) {
        $(entrada).removeAttr('InputPai');
    }

    $(entrada).css('outline-color', 'transparent');
}

// Funções de cápsula que recebem um ângulo e precisam respeitar o modo
// DEG/RAD escolhido no próprio card.
function funcaoUsaAngulo(nome) {
    return nome === 'Math.sin' || nome === 'Math.cos' || nome === 'Math.tan' || nome === 'AanguloTriangulo';
}

function findZindex() {
    $('.ActualDiv').each(function () {
        var zIndex = parseInt($(this).css('z-index'));
        if (!isNaN(zIndex) && zIndex > highestZIndex) {
            highestZIndex = zIndex;
        }
    });
}
function getColor() {
    var color = Math.floor(Math.random() * 16777215).toString(16);
    var regex = /[0-5]/ig;
    color = color.replace(regex, function (char, index) {
        return Math.floor(color[index] * 1.6);
    });
    if (color.length == 5) color = color.concat('f');
    return "#" + color;
}

function getGrayColor() {
    var color = Math.floor(Math.random() * 255).toString(16);
    var regex = /[a-f]/ig;
    color = color.replace(regex, function (char, index) {
        return Math.floor((color.charCodeAt(index) - 97) * 1.6);
    });
    return "#" + color + color + color;
}

function avaliaJanela(input, counter, visitados, profundidade) {
    if (counter !== undefined && counter < 0) {
        return;
    }

    var inputElements = input.querySelectorAll('input');
    var inputForm = inputElements.length;
    var janela = input.parentElement.parentElement; // form, tstDiv, ActualDiv
    var thisDivCount = String(janela.id).replace(/^div/, "");
    var actualName = $(janela).attr("actualname");
    var exit = $(janela).attr("exit");
    var avaliacao = "";
    var modoAngulo = String($(janela).attr("anglemode") || "DEG").toUpperCase();
    modoAngulo = modoAngulo === "RAD" ? "RAD" : "DEG";
    var argumentos = "";

    for (let index = 0; index < inputForm; index++) {
        if (inputElements[index].value == "") {
            argumentos += "0";
        } else {
            argumentos += normalizarEntrada(inputElements[index].value);
        }
        if (index < inputForm - 1) {
            argumentos += ", ";
        }
    }

    if (actualName == "doEval") {
        avaliacao = actualName + "(\"" + argumentos + "\")";
    } else if (funcaoUsaAngulo(actualName) && actualName != "AanguloTriangulo" && modoAngulo == "DEG") {
        // Math.sin/cos/tan trabalham em radianos; nos cards o padrão é DEG.
        avaliacao = actualName + "(((" + argumentos + ") * Math.PI) / 180)";
    } else if (actualName == "AanguloTriangulo") {
        // A área do triângulo por dois lados e o ângulo entre eles também
        // precisa saber se o ângulo digitado está em graus ou radianos.
        avaliacao = actualName + "(" + argumentos + ", \"" + modoAngulo + "\")";
    } else {
        avaliacao = actualName + "(" + argumentos + ")";
    }

    var saidas = [];

    try {
        var x = eval(avaliacao);

        // Remove o ruído de ponto flutuante das funções trigonométricas
        // (Math.sin(30°) = 0.49999999999999994, por exemplo).
        if (funcaoUsaAngulo(actualName) && typeof x === "number" && typeof limparResultado === "function") {
            x = limparResultado(x, actualName !== "AanguloTriangulo");
        }

        // Funções que retornam texto (binário, hexadecimal, ∞ etc.) precisam
        // ser escritas inteiras, e não apenas o primeiro caractere.
        if (typeof x == "number" || typeof x == "string") {
            var iconId = "icon" + thisDivCount + inputForm;
            var icon = document.getElementById(iconId);

            if (icon) {
                icon.innerHTML = x;
                saidas.push({ id: iconId, valor: x });
            }
        } else {
            if (x === undefined || x === null) {
                x = [];
            }

            for (let index = 0; index < exit; index++) {
                var valor = x[index];

                if (String(valor) == "undefined") {
                    valor = "NaN";
                }

                var iconId = "icon" + thisDivCount + (inputForm + index);
                var icon = document.getElementById(iconId);

                if (icon) {
                    icon.innerHTML = valor;
                    saidas.push({ id: iconId, valor: valor });
                }
            }
        }
    } catch (e) {
        if (e instanceof SyntaxError || e instanceof ReferenceError) {
            console.log("Erro esperado, fórmula não concluída.");
            // console.error("Erro:", e);
        } else {
            // Outros tipos de erros que não são de sintaxe
            console.error("Erro:", e);
        }
    }

    // depois de atualizar as saídas, atualiza as caixas filhas
    for (let index = 0; index < saidas.length; index++) {
        propagarValor(
            document.getElementById(saidas[index].id),
            saidas[index].valor,
            visitados,
            (profundidade || 0) + 1
        );
    }
}

// para criar uma div sem o onclick é so colocar o inputForm como 0
function createDiv(AA, options) {
    var nomeForm = AA.option;
    var actualName = AA.form;
    var inputForm = AA.qnt;
    var exit = AA.exit;
    var opcoes = options || {};
    var randomId = opcoes.randomId || ('div' + (divCount + 1));
    divCount = Math.max(divCount, parseInt(String(randomId).replace(/^div/, ''), 10) || 0);
    ActualTop++;
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
    } else {
        tstDiv.css("background-color", colorC);
    }

    var ActualResizeHandleS = $('<div>').addClass('resize-handle s ui-resizable-s'); // S
    var ActualResizeHandleE = $('<div>').addClass('resize-handle e ui-resizable-e') // E
    var ActualResizeHandleW = $('<div>').addClass('resize-handle w ui-resizable-w'); //.css('z-index', '0px'); // W


    var ActualResizeHandleSE = $('<div>').addClass('resize-handle se ui-resizable-se'); // SE

    var angleToggle = null;

    if (funcaoUsaAngulo(actualName)) {
        ActualDiv.attr("anglemode", "DEG");
        angleToggle = $('<button>')
            .attr({
                type: 'button',
                title: 'Alternar entre graus (DEG) e radianos (RAD)',
                'aria-label': 'Ângulo em graus'
            })
            .addClass('angleToggle noCopy')
            .text('DEG');

        angleToggle.on('mousedown', function (evento) {
            evento.stopPropagation();
        });

        angleToggle.on('click', function (evento) {
            evento.preventDefault();
            evento.stopPropagation();

            var novoModo = ActualDiv.attr('anglemode') === 'DEG' ? 'RAD' : 'DEG';
            ActualDiv.attr('anglemode', novoModo);
            $(this)
                .text(novoModo)
                .attr('aria-label', novoModo === 'DEG' ? 'Ângulo em graus' : 'Ângulo em radianos');

            var primeiraEntrada = ActualDiv.find('.inputFormula').first()[0];

            if (primeiraEntrada) {
                avaliarEntrada(primeiraEntrada);
            }
        });
    }

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
                "for": "input" + divCount + index,
                "hidden": ""
            });
            var input = $('<input>').attr('type', 'text').attr('id', "input" + divCount + index).addClass("inputFormula");

            if (AA.placeholder[index] != undefined) {
                input.attr("placeholder", AA.placeholder[index]);
                label.empty();
                label.html(AA.placeholder[index]);
            } else {
                input.attr("placeholder", "Digite o texto");
                label.html("Digite o texto");
            }

            input.css("height", "2.2rem");
            input.css("outline-color", "transparent");
            var valor = "10% + 30px + " + index + " * (min(2rem, 2vh) + 2.2rem - 1px)";
            input.css("top", "calc(" + valor + ")");

            input.keydown(function (event) {
                if (event.which === 13) {
                    event.preventDefault();
                }
            });

            input.on('input', function () {
                if (this._ignorandoDesvinculo) {
                    return;
                }

                if ($(this).attr('InputPai')) {
                    desvincularInputDoPai(this);
                }
            });

            // cria as setas
            var seta = $("<div>").addClass("arrow right").attr('id', "seta" + divCount + index).css("position", "absolute");
            var linha = $('<div>').addClass("linha").attr('id', "linha" + divCount + index); // linha q completa a seta

            seta.css("top", "calc(" + valor + " - 5px + 1.1rem)");
            linha.css("top", "calc(" + valor + " - 2px + 1.1rem)");

            seta.draggable({
                start: function () {
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
                    $(this).css('z-index', highestZIndex + 200);
                },
                stop: function () {
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

        }

        tstDiv.append(form);

        for (let index = 0; index < exit; index++) {

            var icon = $('<div>').addClass('icon noCopy').attr('id', "icon" + divCount + (inputForm + index)); // Unicode emoji for smiling face 
            icon.css("position", "absolute");
            icon.css("outline-color", "transparent");
            icon.on("click", function () {
                var copyText = document.getElementById("icon" + divCount + (inputForm + index));
                navigator.clipboard.writeText(copyText.innerHTML); // copy to clipboard
                ActualTop = 1;
                leftOffset = 0;
                mostrarAlertaGlobal(textoCopiado(), 1000);
            });

            var valor = "10% + 30px + " + (index + inputForm) + " * (min(2rem, 2vh) + 2.2rem - 1px)";
            icon.css("top", "calc(" + valor + ")");


            var seta = $("<div>").addClass("arrow right").attr('id', "seta" + divCount + (inputForm + index)).css("position", "absolute");
            var linha = $('<div>').addClass("linha").attr('id', "linha" + divCount + (inputForm + index)); // linha q completa a seta

            seta.css("top", "calc(" + valor + " - 5px + 1.1rem)");
            linha.css("top", "calc(" + valor + " - 2px + 1.1rem)");


            seta.draggable({
                start: function () {
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
                    $(this).css('z-index', highestZIndex + 9999);
                },
                stop: function () {
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

    if (angleToggle) {
        DraggableDiv.append(angleToggle);
    }

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

        resize: function (event, ui) {
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
                    "top": "calc(" + $("#" + linhaId).css("top") + " - 3px)",
                    "left": ""
                });
            });
        }
    });
    var minHeight = "calc(" + icon.css('top') + " + " + icon.css('height') + " + 30px)";
    if (ActualTop >= 9) {
        ActualTop = 1;
        leftOffset++;
    }
    ActualDiv.css({
        minHeight: minHeight,
        height: minHeight,
        width: "320px",
        zIndex: highestZIndex + 1,
        left: "calc(5vw + " + 50 * ActualTop + "px + " + 50 * leftOffset + "px)",
        top: "calc(20vh + " + 50 * ActualTop + "px + " + 30 * leftOffset + "px)"
    });

    tstDiv.css('min-height', minHeight);
    tstDiv.css('height', minHeight);

    if (ActualTop >= 9) {
        ActualTop = 1;
        leftOffset++;
    }
    DraggableDiv.css({
        zIndex: highestZIndex + 1,
        left: "calc(5vw + " + 50 * ActualTop + "px + " + 50 * leftOffset + "px)",
        top: "calc(20vh + " + 50 * ActualTop + "px + " + 30 * leftOffset + "px)"
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
        drag: function (event, ui) {
            var offset = ui.offset;
            var left = offset.left;
            var top = offset.top;
            $("#" + randomId).css({
                left: left,
                top: top
            });
        }
    });

    CloseR.on('mousedown', function () {

        $("#" + DraggableDiv.attr("id")).remove();
        $("#" + ActualDiv.attr("id")).remove();

    });

    minimize.on('mousedown', function () {
        if (mini == 0) {
            ActualDiv.css('display', 'none');
            mini = 1;
        } else {
            ActualDiv.css('display', 'initial');
            mini = 0;
        }
    });


    $('input[class="inputFormula"]').droppable({
        accept: '.arrow',
        drop: function () {
            this._ignorandoDesvinculo = true;
            try {
                if (String(inputId.attr("id")).includes("icon")) {
                    $(this).val(inputId.text()); // caso a seta venha de um div
                    if (inputId.attr("InputPai")) {
                        $(this).attr("InputPai", inputId.attr("InputPai"));
                        $(this).css("outline-color", document.getElementById(inputId.attr("InputPai")).parentElement.style.backgroundColor);
                    } else {
                        $(this).attr("InputPai", inputId.attr("id"));
                        $(this).css("outline-color", document.getElementById(inputId.attr("id")).parentElement.style.backgroundColor);
                    }
                } else {
                    $(this).val(inputId.val()); // caso a seta venha de um input
                    if (inputId.attr("InputPai")) {
                        $(this).attr("InputPai", inputId.attr("InputPai"));
                        $(this).css("outline-color", document.getElementById(inputId.attr("InputPai")).parentElement.parentElement.style.backgroundColor);
                    } else {
                        $(this).attr("InputPai", inputId.attr("id"));
                        $(this).css("outline-color", document.getElementById(inputId.attr("id")).parentElement.parentElement.style.backgroundColor);
                    }
                }
            } finally {
                this._ignorandoDesvinculo = false;
            }
            avaliarEntrada(this);
            propagarValor(this, this.value);
        }
    });


    $(document).mousedown(function (e) {
        var string = String('#' + randomId + ", #draggable" + randomId);
        if ($(string).children().is(e.target)) {
            ActualTop = 1;
            leftOffset = 0;
            findZindex();
            highestZIndex += 2;
            $("#" + randomId).css("z-index", highestZIndex);
            $("#draggable" + randomId).css("z-index", highestZIndex);
        }
    });

}

// exclusivamente para criar diferentes tipos de entrada
function createEntradaDiv(AA, options) { // Range, range, 1, 1 // Text Area, textarea, 1, 0

    var nomeForm = AA.option;
    var inputInput = AA.form;
    var actualName = AA.type;
    var inputForm = AA.qnt;
    var exit = AA.exit;
    var opcoes = options || {};

    var randomId = opcoes.randomId || ('div' + (divCount + 1));
    divCount = Math.max(divCount, parseInt(String(randomId).replace(/^div/, ''), 10) || 0);
    ActualTop++;
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
    } else {
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
            "for": "input" + divCount + 1,
            "hidden": ""
        }).html(nomeForm);
        var input = $('<' + inputInput + '>').attr('type', actualName).attr('id', "input" + divCount + 1).attr("min", 0).attr("max", 100).attr("value", 0); // .addClass("inputFormula")
        input.css("position", "absolute");
        input.css("left", "3vh");
        input.css("width", "calc(100% - 6vh)");
        input.css("outline-color", "transparent");
        var valor = "3vh + 30px";
        input.css("top", "calc(" + valor + ")");
        if (exit == 0) { // somente p textarea
            input.css({
                "height": "calc(100% - (6vh + 30px))",
                "max-height": "calc(100% - (6vh + 30px))",
                "padding": "1rem",
                "font-size": "18px",
                "font-weight": "bold",
                "min-height": "4.4rem"
            });
        } else {
            input.css("height", "2.2rem");
        }
        input.addClass("inputFormula");
        input.on('input', function () {
            if (this._ignorandoDesvinculo) {
                return;
            }

            if ($(this).attr('InputPai')) {
                desvincularInputDoPai(this);
            }
        });

        // add ao form
        form.append(label);
        form.append(input);
        tstDiv.append(form);

        if (exit != 0) {
            var icon = $('<div>').addClass('icon noCopy').attr('id', "icon" + divCount + (inputForm + 1)); // Unicode emoji for smiling face 
            icon.css("position", "absolute");
            icon.css("left", "10%");
            icon.css("outline-color", "transparent");
            icon.on("click", function () {
                var copyText = document.getElementById("icon" + divCount + (inputForm + 1));
                navigator.clipboard.writeText(copyText.innerHTML); // copy to clipboard
                ActualTop = 1;
                leftOffset = 0;
                mostrarAlertaGlobal(textoCopiado(), 1000);
            });

            var valor = "10% + 60px + 2.2rem";
            icon.css("top", "calc(" + valor + ")");


            var seta = $("<div>").addClass("arrow right").attr('id', "seta" + divCount + (inputForm + 1)).css("position", "absolute");
            var linha = $('<div>').addClass("linha").attr('id', "linha" + divCount + (inputForm + 1)); // linha q completa a seta

            seta.css("top", "calc(" + valor + " - 5px + 1.1rem)");
            linha.css("top", "calc(" + valor + " - 2px + 1.1rem)");


            seta.draggable({
                start: function () {
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
                    $(this).css('z-index', highestZIndex + 200);
                },
                stop: function () {
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

            form.on('input', function () {
                icon.text(input.val());
                propagarValor(icon[0], icon.text());
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

        resize: function (event, ui) {
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
            input.css("max-height", "calc(" + tstDiv.css("height") + " - 20% - 30px)");

            $(".tstDiv > .arrow").each(function () {
                linhaId = this.id.replace("seta", "linha");
                $(this).css({
                    "top": "calc(" + $("#" + linhaId).css("top") + " - 3px)",
                    "left": ""
                });
            });

        }
    });
    if (exit != 0) {
        var minHeight = "calc(" + icon.css('top') + " + " + icon.css('height') + " + 30px)";
    } else {
        var minHeight = "calc(20% + 30px)";
    }
    if (ActualTop >= 9) {
        ActualTop = 1;
        leftOffset++;
    }
    ActualDiv.css({
        minHeight: minHeight,
        height: minHeight,
        width: "320px",
        zIndex: highestZIndex + 1,
        left: "calc(5vw + " + 50 * ActualTop + "px + " + 50 * leftOffset + "px)",
        top: "calc(20vh + " + 50 * ActualTop + "px + " + 30 * leftOffset + "px)"
    });

    if (exit == 0) {
        var minHeight = "100%";
    }

    tstDiv.css('min-height', minHeight);
    DraggableDiv.css({
        'z-index': highestZIndex + 1,
        left: "calc(5vw + " + 50 * ActualTop + "px + " + 50 * leftOffset + "px)",
        top: "calc(20vh + " + 50 * ActualTop + "px + " + 30 * leftOffset + "px)"
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
        drag: function (event, ui) {
            var offset = ui.offset;
            var left = offset.left;
            var top = offset.top;

            $("#" + randomId).css({
                left: left,
                top: top
            });
        }
    });

    CloseR.on('mousedown', function () {

        $("#" + DraggableDiv.attr("id")).remove();
        $("#" + ActualDiv.attr("id")).remove();

    });

    minimize.on('mousedown', function () {
        if (mini == 0) {
            ActualDiv.css('display', 'none');
            mini = 1;
        } else {
            ActualDiv.css('display', 'initial');
            mini = 0;
        }
    });

    $('input[class="inputFormula"]').droppable({
        accept: '.arrow',
        drop: function () {
            this._ignorandoDesvinculo = true;
            try {
                if (String(inputId.attr("id")).includes("icon")) {
                    $(this).val(inputId.text()); // caso a seta venha de um div
                    if (inputId.attr("InputPai")) {
                        $(this).attr("InputPai", inputId.attr("InputPai"));
                        $(this).css("outline-color", document.getElementById(inputId.attr("InputPai")).parentElement.style.backgroundColor);
                    } else {
                        $(this).attr("InputPai", inputId.attr("id"));
                        $(this).css("outline-color", document.getElementById(inputId.attr("id")).parentElement.style.backgroundColor);
                    }
                } else {
                    $(this).val(inputId.val()); // caso a seta venha de um input
                    if (inputId.attr("InputPai")) {
                        $(this).attr("InputPai", inputId.attr("InputPai"));
                        $(this).css("outline-color", document.getElementById(inputId.attr("InputPai")).parentElement.parentElement.style.backgroundColor);
                    } else {
                        $(this).attr("InputPai", inputId.attr("id"));
                        $(this).css("outline-color", document.getElementById(inputId.attr("id")).parentElement.parentElement.style.backgroundColor);
                    }
                }
            } finally {
                this._ignorandoDesvinculo = false;
            }
            avaliarEntrada(this);
            propagarValor(this, this.value);
        }
    });

    $(document).mousedown(function (e) {
        var string = String('#' + randomId + ", #draggable" + randomId);
        if ($(string).children().is(e.target)) {
            findZindex();
            ActualTop = 1;
            leftOffset = 0;
            highestZIndex += 2;
            $("#" + randomId).css("z-index", highestZIndex);
            $("#draggable" + randomId).css("z-index", highestZIndex);
        }
    });
}

function uploadImg(selectedFile, naturalHeight, naturalWidth, nomeArquivo, opcoes) {
    if (selectedFile) {

        var ar = 0;
        var opcoes = opcoes || {};

        var randomId = opcoes.randomId || ('div' + (divCount + 1));
        divCount = Math.max(divCount, parseInt(String(randomId).replace(/^div/, ''), 10) || 0);
        var mini = 0;
        var ActualDiv = $('<div>').attr('id', randomId).addClass('ActualDiv noCopy');
        var DraggableDiv = $('<div>').attr('id', 'draggable' + randomId).addClass('DraggableDiv');
        var nome = $('<input type="text">').css("margin", "0px").addClass("noCopy hiddenName");

        if (nomeArquivo) {
            nome.val(nomeArquivo);
        }
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
            "hidden": ""
        });
        var imgElement = $("<img>", {
            id: "previewImage",
            src: selectedFile,
            alt: "Imagem selecionada",
            style: "min-width: 290px; min-height: 290px; max-width:100%; max-height:100%; position: relative;"
        });

        if (naturalHeight > naturalWidth) {
            ar = naturalHeight / naturalWidth;
            tstDiv.css({
                height: 320 * ar + "px",
                'min-height': 320 * ar + "px",
                'min-width': "320px",
                width: '320px'
            });
            ActualDiv.css({
                height: 320 * ar + "px",
                'min-height': 320 * ar + "px",
                'min-width': "320px",
                width: '320px'
            });
            DraggableDiv.css({
                'min-width': "320px",
                width: '320px'
            });
            ActualResizeHandleE.css("height", 320 * ar + "px");
            ActualResizeHandleW.css("height", 320 * ar + "px");
            // ActualResizeHandleE.css("min-height", 320*ar+"px");
            // ActualResizeHandleW.css("min-height", 320*ar+"px");
            imgElement.css("min-height", 290 * ar + "px");

        } else {
            ar = naturalWidth / naturalHeight;
            tstDiv.css({
                height: "320px",
                'min-height': "320px",
                'min-width': 290 * ar + "px",
                width: 290 * ar + "px"
            });
            ActualDiv.css({
                height: "320px",
                'min-height': "320px",
                'min-width': 290 * ar + "px",
                width: 290 * ar + "px"
            });
            DraggableDiv.css({
                'min-width': 290 * ar + "px",
                width: 290 * ar + "px"
            });
            ActualResizeHandleS.css("width", 290 * ar + "px");
            imgElement.css("min-width", 290 * ar + "px");
        }



        // espalha as imagens novas pela área de trabalho em vez de empilhar todas no mesmo ponto
        var colunaImagem = (divCount - 1) % 6;
        var linhaImagem = Math.floor((divCount - 1) / 6) % 5;
        var posicaoImagem = {
            left: 'calc(5vw + ' + (colunaImagem * 46) + 'px)',
            top: 'calc(16vh + ' + (linhaImagem * 46) + 'px)'
        };

        highestZIndex += 2;
        ActualDiv.css({
            left: posicaoImagem.left,
            top: posicaoImagem.top,
            zIndex: highestZIndex
        });
        DraggableDiv.css({
            left: posicaoImagem.left,
            top: posicaoImagem.top,
            zIndex: highestZIndex
        });

        if (opcoes.atrr) {
            if (opcoes.atrr.left) {
                ActualDiv.css('left', opcoes.atrr.left);
                DraggableDiv.css('left', opcoes.atrr.left);
            }
            if (opcoes.atrr.top) {
                ActualDiv.css('top', opcoes.atrr.top);
                DraggableDiv.css('top', opcoes.atrr.top);
            }
            if (opcoes.atrr.width) {
                ActualDiv.css('width', opcoes.atrr.width);
                DraggableDiv.css('width', opcoes.atrr.width);
                tstDiv.css('width', opcoes.atrr.width);
            }
            if (opcoes.atrr.height) {
                ActualDiv.css('height', opcoes.atrr.height);
                tstDiv.css('height', opcoes.atrr.height);
            }
        }

        $('body').append(ActualDiv);
        $('body').append(DraggableDiv);
        DraggableDiv.append(nome);
        DraggableDiv.append(minimize);
        DraggableDiv.append(CloseR);
        tstDiv.append(label);
        tstDiv.append(imgElement);
        ActualDiv.append(tstDiv);
        ActualDiv.append(ActualResizeHandleS);
        ActualDiv.append(ActualResizeHandleE);
        ActualDiv.append(ActualResizeHandleW);

        ActualDiv.append(ActualResizeHandleSE);

        nome.keydown(em => {
            let div = document.createElement("div");
            div.setAttribute("style", "width: auto; white-space: nowrap;");
            div.innerHTML = em.target.value;
            let size = em.target.value.length + 1;
            console.log(div.style.width);
            console.log(div.innerHTML);
            
            if ((size * 12) <= (parseInt(em.target.parentElement.style.width) - 100)) {
                nome.css("width", "calc(" + size * 12 + "px + 20px)");
            }
        });

        ActualDiv.resizable({
            handles: {
                s: ".s",
                e: ".e",
                se: ".se",
            },
            minHeight: 50,
            minWidth: 50,
            resize: function (event, ui) {
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
            drag: function (event, ui) {
                var offset = ui.offset;
                var left = offset.left;
                var top = offset.top;

                $("#" + randomId).css({
                    left: left,
                    top: top
                });
            }
        });
        CloseR.on('mousedown', function () {

            $("#" + DraggableDiv.attr("id")).remove();
            $("#" + ActualDiv.attr("id")).remove();

        });

        minimize.on('mousedown', function () {
            if (mini == 0) {
                ActualDiv.children().hide();
                mini = 1;
            } else {
                ActualDiv.children().show();
                mini = 0;
            }
        });

    } else {
        alert('Nenhum arquivo selecionado.');
    }
}

// Um único handler para todos os inputs de função. Antes cada cápsula criada
// registrava outro handler global, o que duplicava as atualizações.
$(document).on('input', '.inputFormula', function () {
    var janela = $(this).closest('.ActualDiv');

    if (janela.length == 0 || !janela.attr('actualname')) {
        return;
    }

    avaliarEntrada(this);
    propagarValor(this, this.value);
});

window.addEventListener('resize', function () {
    $(".tstDiv > .arrow").each(function () {
        linhaId = this.id.replace("seta", "linha");
        $(this).css({
            "top": "calc(" + $("#" + linhaId).css("top") + " - 3px)",
            "left": ""
        });
    });
});

// $(document).mousedown(function () {
//     counter = 200; // ACABA A PORCARIA DO BUG GRAÇADEUS
// });

// $(document).on("input", function () {
//     counter = 200;
// });

function saveJson(element) {
    var tstDiv = document.querySelector("#" + element.id + " .tstDiv");
    var img = document.querySelector("#" + element.id + " img");
    var nomeImagem = document.querySelector("#draggable" + element.id + " .hiddenName");
    var nomeP = document.querySelector("#draggable" + element.id + " p");
    var campoEntrada = document.querySelector("#" + element.id + " textarea.inputFormula, #" + element.id + " input.inputFormula");
    var JsonWindow = {
        "ActualDiv": element.id,
        "name": nomeP ? nomeP.innerHTML : (nomeImagem ? nomeImagem.value : ""),
        "atrr": {
            "left": element.style.left,
            "top": element.style.top,
            "width": element.style.width,
            "height": element.style.height,
            "zIndex": element.style.zIndex,
            "actualcolor": tstDiv && tstDiv.attributes.actualcolor ? tstDiv.attributes.actualcolor.value : null,
            "graycolor": tstDiv && tstDiv.attributes.graycolor ? tstDiv.attributes.graycolor.value : null
        }
    }

    if (element.attributes.actualname != undefined) {
        JsonWindow["function"] = element.attributes.actualname.value;
    }

    if (element.attributes.anglemode != undefined) {
        JsonWindow["angleMode"] = element.attributes.anglemode.value;
    }

    // metadados de cards de entrada (textarea/range) para restauração correta
    if (element.attributes.actualname == undefined && !img && campoEntrada) {
        JsonWindow["form"] = campoEntrada.tagName.toLowerCase();
        JsonWindow["type"] = campoEntrada.getAttribute("type") || "";
    }

    if (img) {
        JsonWindow["imagem"] = img.src;
        JsonWindow["nomeImagem"] = nomeImagem ? nomeImagem.value : null;
        JsonWindow["imagemW"] = img.naturalWidth || img.width || 0;
        JsonWindow["imagemH"] = img.naturalHeight || img.height || 0;
    }

    if (document.querySelectorAll("#" + element.id + " .inputFormula").length != 0) {
        JsonWindow["input"] = [];
        document.querySelectorAll("#" + element.id + " .inputFormula").forEach(em => {
            if (em.attributes.inputpai) {
                JsonWindow["input"].push({
                    "value": em.value,
                    "inputpai": em.attributes.inputpai.value,
                    "outline-color": em.style.outlineColor
                });
            } else {
                JsonWindow["input"].push({
                    "value": em.value
                });
            }
        });
    }

    if (document.querySelectorAll("#" + element.id + " .icon").length != 0) {
        JsonWindow["icon"] = [];
        document.querySelectorAll("#" + element.id + " .icon").forEach(em => {
            JsonWindow["icon"].push(em.innerHTML);
        });
    }

    return JsonWindow;
}

function saveAll() {
    var json = {
        "success": "true",
        "language": linguagem,
        "theme": tema,
        "customColor": customColor,
        "windows": []
    }
    document.querySelectorAll(".ActualDiv").forEach(em => {
        json["windows"].push(saveJson(em));
    });

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json, null, 2));
    var download = document.createElement('a');
    download.setAttribute("href", dataStr);
    download.setAttribute("download", "backup.json");
    document.body.appendChild(download); // necessário para o Firefox
    download.click();
    download.remove();
}