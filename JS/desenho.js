/* Área de desenho: ferramentas, histórico por traços e exportação. */
(function () {
    'use strict';

    var MAX_ESTADOS = 80;
    var DISTANCIA_MINIMA = 0.6;
    var ASPECTO_MAXIMO = 2.2;
    var LARGURA_MAXIMA = 200;

    var canvas = null;
    var ctx = null;
    var divCanvas = null;
    var follower = null;
    var sizeRange = null;
    var sizeText = null;
    var colorPicker = null;
    var toast = null;
    var emptyHint = null;
    var btnUndo = null;
    var btnRedo = null;

    var ferramentas = {
        pen: true,
        highlighter: true,
        eraser: true,
        line: true,
        rect: true,
        ellipse: true,
        arrow: true
    };

    var ferramentasDeForma = {
        line: true,
        rect: true,
        ellipse: true,
        arrow: true
    };

    var estado = {
        ferramenta: 'pen',
        cor: '#000000',
        tamanho: 5,
        tracos: [],
        historico: [[]],
        posicaoHistorico: 0,
        desenhando: false,
        pointerId: null,
        tracoAtual: null,
        largura: 0,
        altura: 0,
        dpr: 1,
        renderPendente: false,
        toastTimer: 0
    };

    function iniciar() {
        canvas = document.getElementById('myCanvas');

        if (!canvas) {
            return;
        }

        divCanvas = document.getElementById('divCanvas');
        ctx = canvas.getContext('2d');
        follower = document.getElementById('mouseFollower');
        sizeRange = document.getElementById('sizeRange');
        sizeText = document.getElementById('sizeText');
        colorPicker = document.getElementById('ColPck');
        toast = document.getElementById('drawToast');
        emptyHint = document.getElementById('drawEmptyHint');
        btnUndo = document.getElementById('drawUndo');
        btnRedo = document.getElementById('drawRedo');

        configurarFerramentas();
        configurarTamanho();
        configurarCores();
        configurarAcoes();
        configurarCanvas();
        configurarAtalhos();

        definirCor(colorPicker ? colorPicker.value : '#000000');
        definirTamanho(sizeText && sizeText.value ? sizeText.value : 5, true);
        definirFerramenta('pen');
        ajustarCanvas();
        atualizarDicaVazio();
        atualizarBotoesHistorico();

        window.addEventListener('resize', ajustarCanvas);

        if (window.ResizeObserver && divCanvas) {
            new ResizeObserver(function () {
                ajustarCanvas();
            }).observe(divCanvas);
        }

        window.addEventListener('load', ajustarCanvas);
    }

    /* ---------------------------------------------------------------
     * Ferramentas, tamanho e cor
     * ------------------------------------------------------------- */

    function configurarFerramentas() {
        var botoes = document.querySelectorAll('.drawTool');

        Array.prototype.forEach.call(botoes, function (botao) {
            botao.addEventListener('click', function () {
                definirFerramenta(botao.getAttribute('data-tool'));
            });
        });
    }

    function definirFerramenta(nome) {
        if (!ferramentas[nome]) {
            return;
        }

        descartarTracoAtual();
        estado.ferramenta = nome;

        var botoes = document.querySelectorAll('.drawTool');

        Array.prototype.forEach.call(botoes, function (botao) {
            var ativo = botao.getAttribute('data-tool') === nome;
            botao.classList.toggle('active', ativo);
            botao.setAttribute('aria-pressed', ativo ? 'true' : 'false');
        });

        if (divCanvas) {
            divCanvas.setAttribute('data-tool', nome);
            divCanvas.classList.toggle('draw-shape-tool', !!ferramentasDeForma[nome]);
        }

        if (ferramentasDeForma[nome] && follower) {
            follower.style.opacity = '0';
        }

        atualizarFollowerTamanho();
    }

    function configurarTamanho() {
        if (sizeRange) {
            sizeRange.addEventListener('input', function () {
                definirTamanho(this.value, true);
            });
        }

        if (sizeText) {
            sizeText.addEventListener('input', function () {
                if (this.value === '') {
                    return;
                }

                var valor = parseInt(this.value, 10);

                if (isFinite(valor)) {
                    definirTamanho(valor, false);
                }
            });

            sizeText.addEventListener('change', function () {
                definirTamanho(this.value, true);
            });

            sizeText.addEventListener('blur', function () {
                definirTamanho(this.value, true);
            });

            sizeText.addEventListener('keydown', function (evento) {
                if (evento.key === 'Enter') {
                    evento.preventDefault();
                    this.blur();
                }
            });
        }
    }

    function definirTamanho(valor, sincronizarTexto) {
        var numero = Math.round(Number(valor));

        if (!isFinite(numero)) {
            numero = estado.tamanho;
        }

        numero = Math.max(1, Math.min(LARGURA_MAXIMA, numero));
        estado.tamanho = numero;

        if (sizeRange) {
            var maximo = Number(sizeRange.max) || 60;
            sizeRange.value = Math.min(numero, maximo);
        }

        if (sincronizarTexto && sizeText && String(sizeText.value) !== String(numero)) {
            sizeText.value = numero;
        }

        atualizarFollowerTamanho();
    }

    function atualizarFollowerTamanho() {
        if (!follower) {
            return;
        }

        var espessura = espessuraEfetiva(estado.ferramenta, estado.tamanho);
        var tamanhoVisual = Math.max(4, espessura);

        follower.style.width = tamanhoVisual + 'px';
        follower.style.height = tamanhoVisual + 'px';
    }

    function espessuraEfetiva(ferramenta, tamanho) {
        if (ferramenta === 'highlighter') {
            return Math.max(2, tamanho * 3.4);
        }

        if (ferramenta === 'eraser') {
            return Math.max(2, tamanho * 2.6);
        }

        return Math.max(1, tamanho);
    }

    function configurarCores() {
        if (colorPicker) {
            colorPicker.addEventListener('input', function () {
                definirCor(this.value);
            });

            colorPicker.addEventListener('change', function () {
                definirCor(this.value);
            });
        }

        var amostras = document.querySelectorAll('.drawSwatch');

        Array.prototype.forEach.call(amostras, function (amostra) {
            amostra.addEventListener('click', function () {
                definirCor(amostra.getAttribute('data-color'));
            });
        });
    }

    function definirCor(cor) {
        if (!/^#[0-9a-f]{6}$/i.test(cor || '')) {
            return;
        }

        estado.cor = cor.toLowerCase();

        if (colorPicker && colorPicker.value.toLowerCase() !== estado.cor) {
            colorPicker.value = estado.cor;
        }

        var amostras = document.querySelectorAll('.drawSwatch');

        Array.prototype.forEach.call(amostras, function (amostra) {
            var ativa = String(amostra.getAttribute('data-color')).toLowerCase() === estado.cor;
            amostra.classList.toggle('active', ativa);
            amostra.setAttribute('aria-pressed', ativa ? 'true' : 'false');
        });
    }

    /* ---------------------------------------------------------------
     * Eventos do canvas
     * ------------------------------------------------------------- */

    function configurarCanvas() {
        canvas.addEventListener('pointerdown', aoPressionar);
        canvas.addEventListener('pointermove', aoMover);
        canvas.addEventListener('pointerup', aoSoltar);
        canvas.addEventListener('pointercancel', aoCancelar);
        canvas.addEventListener('lostpointercapture', aoPerderCaptura);
        canvas.addEventListener('contextmenu', function (evento) {
            evento.preventDefault();
        });

        canvas.addEventListener('pointerenter', function (evento) {
            if (!follower) {
                return;
            }

            if (evento.pointerType === 'touch' || ferramentasDeForma[estado.ferramenta]) {
                follower.style.opacity = '0';
            }
        });

        canvas.addEventListener('pointerleave', function () {
            if (follower) {
                follower.style.opacity = '0';
            }
        });
    }

    function aoPressionar(evento) {
        if (evento.pointerType === 'mouse' && evento.button !== 0) {
            return;
        }

        if (!ferramentas[estado.ferramenta]) {
            return;
        }

        evento.preventDefault();

        var retangulo = canvas.getBoundingClientRect();
        var ponto = obterPonto(evento, retangulo);

        estado.desenhando = true;
        estado.pointerId = evento.pointerId;

        if (canvas.setPointerCapture) {
            try {
                canvas.setPointerCapture(evento.pointerId);
            } catch (erro) {
                /* alguns navegadores não permitem capturar o ponteiro aqui */
            }
        }

        var espessura = espessuraEfetiva(estado.ferramenta, estado.tamanho);

        if (ferramentasDeForma[estado.ferramenta]) {
            estado.tracoAtual = {
                tipo: estado.ferramenta,
                ferramenta: estado.ferramenta,
                cor: estado.cor,
                espessura: espessura,
                x1: ponto.x,
                y1: ponto.y,
                x2: ponto.x,
                y2: ponto.y
            };
        } else {
            estado.tracoAtual = {
                tipo: 'free',
                ferramenta: estado.ferramenta,
                cor: estado.cor,
                espessura: espessura,
                pontos: [ponto]
            };
        }

        if (emptyHint) {
            emptyHint.classList.add('hidden');
        }

        posicionarFollower(ponto.x, ponto.y, evento.pointerType !== 'touch');
        agendarRender();
    }

    function aoMover(evento) {
        var retangulo = canvas.getBoundingClientRect();
        var ponto = obterPonto(evento, retangulo);

        posicionarFollower(ponto.x, ponto.y, evento.pointerType !== 'touch');

        if (!estado.desenhando || evento.pointerId !== estado.pointerId) {
            return;
        }

        evento.preventDefault();

        var traco = estado.tracoAtual;

        if (!traco) {
            return;
        }

        if (traco.tipo === 'free') {
            var eventos = obterEventosCoalescidos(evento);

            for (var i = 0; i < eventos.length; i++) {
                adicionarPonto(traco, obterPonto(eventos[i], retangulo));
            }
        } else {
            atualizarPontoFinal(traco, ponto, evento.shiftKey);
        }

        agendarRender();
    }

    function aoSoltar(evento) {
        if (!estado.desenhando) {
            return;
        }

        if (estado.pointerId !== null && evento.pointerId !== estado.pointerId) {
            return;
        }

        var retangulo = canvas.getBoundingClientRect();
        var ponto = obterPonto(evento, retangulo);
        var traco = estado.tracoAtual;
        var pointerId = estado.pointerId;

        if (traco) {
            if (traco.tipo === 'free') {
                adicionarPonto(traco, ponto);
            } else {
                atualizarPontoFinal(traco, ponto, evento.shiftKey);
            }
        }

        estado.desenhando = false;
        estado.pointerId = null;
        estado.tracoAtual = null;

        if (pointerId !== null && canvas.hasPointerCapture && canvas.hasPointerCapture(pointerId)) {
            try {
                canvas.releasePointerCapture(pointerId);
            } catch (erro) {
                /* ignore */
            }
        }

        if (traco && tracoValido(traco)) {
            estado.tracos.push(traco);
            salvarEstado();
        }

        atualizarDicaVazio();
        agendarRender();
    }

    function aoCancelar(evento) {
        if (!estado.desenhando) {
            return;
        }

        if (estado.pointerId !== null && evento.pointerId !== estado.pointerId) {
            return;
        }

        descartarTracoAtual();
    }

    function aoPerderCaptura() {
        if (estado.desenhando) {
            descartarTracoAtual();
        }
    }

    function descartarTracoAtual() {
        if (!estado.desenhando) {
            return;
        }

        var pointerId = estado.pointerId;

        estado.desenhando = false;
        estado.pointerId = null;
        estado.tracoAtual = null;

        if (pointerId !== null && canvas.hasPointerCapture && canvas.hasPointerCapture(pointerId)) {
            try {
                canvas.releasePointerCapture(pointerId);
            } catch (erro) {
                /* ignore */
            }
        }

        atualizarDicaVazio();
        agendarRender();
    }

    function obterEventosCoalescidos(evento) {
        var lista = [];

        if (typeof evento.getCoalescedEvents === 'function') {
            try {
                lista = evento.getCoalescedEvents() || [];
            } catch (erro) {
                lista = [];
            }
        }

        if (!lista.length) {
            return [evento];
        }

        var ultimo = lista[lista.length - 1];

        if (ultimo.clientX !== evento.clientX || ultimo.clientY !== evento.clientY) {
            lista.push(evento);
        }

        return lista;
    }

    function obterPonto(evento, retangulo) {
        var x = evento.clientX - retangulo.left;
        var y = evento.clientY - retangulo.top;

        return {
            x: Math.max(0, Math.min(estado.largura, x)),
            y: Math.max(0, Math.min(estado.altura, y))
        };
    }

    function adicionarPonto(traco, ponto) {
        var pontos = traco.pontos;
        var ultimo = pontos[pontos.length - 1];

        if (ultimo) {
            var dx = ponto.x - ultimo.x;
            var dy = ponto.y - ultimo.y;

            if (dx * dx + dy * dy < DISTANCIA_MINIMA * DISTANCIA_MINIMA) {
                return;
            }
        }

        pontos.push(ponto);
    }

    function atualizarPontoFinal(traco, ponto, shift) {
        var dx = ponto.x - traco.x1;
        var dy = ponto.y - traco.y1;

        if ((traco.tipo === 'line' || traco.tipo === 'arrow') && shift) {
            var comprimento = Math.sqrt(dx * dx + dy * dy);
            var passo = Math.PI / 4;
            var angulo = Math.round(Math.atan2(dy, dx) / passo) * passo;

            traco.x2 = traco.x1 + Math.cos(angulo) * comprimento;
            traco.y2 = traco.y1 + Math.sin(angulo) * comprimento;
            return;
        }

        if ((traco.tipo === 'rect' || traco.tipo === 'ellipse') && shift) {
            var lado = Math.max(Math.abs(dx), Math.abs(dy));

            traco.x2 = traco.x1 + (dx >= 0 ? lado : -lado);
            traco.y2 = traco.y1 + (dy >= 0 ? lado : -lado);
            return;
        }

        traco.x2 = ponto.x;
        traco.y2 = ponto.y;
    }

    function posicionarFollower(x, y, visivel) {
        if (!follower) {
            return;
        }

        if (ferramentasDeForma[estado.ferramenta]) {
            follower.style.opacity = '0';
            return;
        }

        follower.style.left = x + 'px';
        follower.style.top = y + 'px';
        follower.style.opacity = visivel ? '1' : '0';
    }

    /* ---------------------------------------------------------------
     * Renderização
     * ------------------------------------------------------------- */

    function ajustarCanvas() {
        if (!canvas || !divCanvas) {
            return;
        }

        var retangulo = divCanvas.getBoundingClientRect();
        var largura = Math.max(1, Math.round(retangulo.width));
        var altura = Math.max(1, Math.round(retangulo.height));
        var dpr = Math.min(3, Math.max(1, window.devicePixelRatio || 1));
        var larguraFisica = Math.round(largura * dpr);
        var alturaFisica = Math.round(altura * dpr);

        if (canvas.width === larguraFisica && canvas.height === alturaFisica && estado.largura === largura && estado.altura === altura) {
            return;
        }

        estado.largura = largura;
        estado.altura = altura;
        estado.dpr = dpr;
        canvas.width = larguraFisica;
        canvas.height = alturaFisica;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        agendarRender();
    }

    function agendarRender() {
        if (estado.renderPendente) {
            return;
        }

        estado.renderPendente = true;

        window.requestAnimationFrame(function () {
            estado.renderPendente = false;
            renderizar();
        });
    }

    function renderizar() {
        if (!ctx) {
            return;
        }

        ctx.setTransform(estado.dpr, 0, 0, estado.dpr, 0, 0);
        ctx.clearRect(0, 0, estado.largura, estado.altura);

        for (var i = 0; i < estado.tracos.length; i++) {
            desenharTraco(estado.tracos[i]);
        }

        if (estado.tracoAtual) {
            desenharTraco(estado.tracoAtual);
        }
    }

    function desenharTraco(traco) {
        if (!traco) {
            return;
        }

        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = traco.cor;
        ctx.fillStyle = traco.cor;
        ctx.lineWidth = Math.max(0.5, traco.espessura);

        if (traco.ferramenta === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
        } else if (traco.ferramenta === 'highlighter') {
            ctx.globalAlpha = 0.32;
        }

        if (traco.tipo === 'free') {
            desenharLivre(traco);
        } else if (traco.tipo === 'line') {
            desenharLinha(traco);
        } else if (traco.tipo === 'rect') {
            desenharRetangulo(traco);
        } else if (traco.tipo === 'ellipse') {
            desenharElipse(traco);
        } else if (traco.tipo === 'arrow') {
            desenharSeta(traco);
        }

        ctx.restore();
    }

    function desenharLivre(traco) {
        var pontos = traco.pontos;

        if (!pontos.length) {
            return;
        }

        if (pontos.length === 1) {
            ctx.beginPath();
            ctx.arc(pontos[0].x, pontos[0].y, Math.max(0.6, traco.espessura / 2), 0, Math.PI * 2);
            ctx.fill();
            return;
        }

        ctx.beginPath();
        ctx.moveTo(pontos[0].x, pontos[0].y);

        if (pontos.length === 2) {
            ctx.lineTo(pontos[1].x, pontos[1].y);
            ctx.stroke();
            return;
        }

        for (var i = 1; i < pontos.length - 1; i++) {
            var ponto = pontos[i];
            var proximo = pontos[i + 1];
            var meioX = (ponto.x + proximo.x) / 2;
            var meioY = (ponto.y + proximo.y) / 2;

            ctx.quadraticCurveTo(ponto.x, ponto.y, meioX, meioY);
        }

        var ultimo = pontos[pontos.length - 1];
        ctx.lineTo(ultimo.x, ultimo.y);
        ctx.stroke();
    }

    function desenharLinha(traco) {
        ctx.beginPath();
        ctx.moveTo(traco.x1, traco.y1);
        ctx.lineTo(traco.x2, traco.y2);
        ctx.stroke();
    }

    function desenharRetangulo(traco) {
        var x = Math.min(traco.x1, traco.x2);
        var y = Math.min(traco.y1, traco.y2);
        var largura = Math.abs(traco.x2 - traco.x1);
        var altura = Math.abs(traco.y2 - traco.y1);

        ctx.beginPath();
        ctx.rect(x, y, largura, altura);
        ctx.stroke();
    }

    function desenharElipse(traco) {
        var centroX = (traco.x1 + traco.x2) / 2;
        var centroY = (traco.y1 + traco.y2) / 2;
        var raioX = Math.abs(traco.x2 - traco.x1) / 2;
        var raioY = Math.abs(traco.y2 - traco.y1) / 2;

        ctx.beginPath();
        ctx.ellipse(centroX, centroY, Math.max(0.5, raioX), Math.max(0.5, raioY), 0, 0, Math.PI * 2);
        ctx.stroke();
    }

    function desenharSeta(traco) {
        var angulo = Math.atan2(traco.y2 - traco.y1, traco.x2 - traco.x1);
        var ponta = Math.max(9, traco.espessura * 2.7);
        var abertura = Math.PI / 7;

        ctx.beginPath();
        ctx.moveTo(traco.x1, traco.y1);
        ctx.lineTo(traco.x2, traco.y2);
        ctx.moveTo(traco.x2, traco.y2);
        ctx.lineTo(traco.x2 - ponta * Math.cos(angulo - abertura), traco.y2 - ponta * Math.sin(angulo - abertura));
        ctx.moveTo(traco.x2, traco.y2);
        ctx.lineTo(traco.x2 - ponta * Math.cos(angulo + abertura), traco.y2 - ponta * Math.sin(angulo + abertura));
        ctx.stroke();
    }

    function tracoValido(traco) {
        if (!traco) {
            return false;
        }

        if (traco.tipo === 'free') {
            return traco.pontos.length > 0;
        }

        var largura = Math.abs(traco.x2 - traco.x1);
        var altura = Math.abs(traco.y2 - traco.y1);

        if (traco.tipo === 'line' || traco.tipo === 'arrow') {
            return Math.sqrt(largura * largura + altura * altura) >= 1.5;
        }

        return largura >= 1.5 && altura >= 1.5;
    }

    /* ---------------------------------------------------------------
     * Histórico
     * ------------------------------------------------------------- */

    function salvarEstado() {
        if (estado.posicaoHistorico < estado.historico.length - 1) {
            estado.historico.splice(estado.posicaoHistorico + 1);
        }

        estado.historico.push(estado.tracos.slice());

        if (estado.historico.length > MAX_ESTADOS + 1) {
            estado.historico.shift();
        }

        estado.posicaoHistorico = estado.historico.length - 1;
        atualizarBotoesHistorico();
    }

    function desfazer() {
        if (estado.desenhando || estado.posicaoHistorico <= 0) {
            return;
        }

        estado.posicaoHistorico--;
        restaurarHistorico();
    }

    function refazer() {
        if (estado.desenhando || estado.posicaoHistorico >= estado.historico.length - 1) {
            return;
        }

        estado.posicaoHistorico++;
        restaurarHistorico();
    }

    function restaurarHistorico() {
        estado.tracos = estado.historico[estado.posicaoHistorico].slice();
        estado.tracoAtual = null;
        atualizarBotoesHistorico();
        atualizarDicaVazio();
        agendarRender();
    }

    function atualizarBotoesHistorico() {
        if (btnUndo) {
            btnUndo.disabled = estado.posicaoHistorico <= 0;
        }

        if (btnRedo) {
            btnRedo.disabled = estado.posicaoHistorico >= estado.historico.length - 1;
        }
    }

    function limparCanvas() {
        descartarTracoAtual();

        if (!estado.tracos.length) {
            mostrarToast('O quadro já está vazio.');
            return;
        }

        estado.tracos = [];
        salvarEstado();
        atualizarDicaVazio();
        agendarRender();
        mostrarToast('Quadro limpo. Use Ctrl+Z para desfazer.');
    }

    function atualizarDicaVazio() {
        if (!emptyHint) {
            return;
        }

        emptyHint.classList.toggle('hidden', estado.tracos.length > 0);
    }

    /* ---------------------------------------------------------------
     * Exportação
     * ------------------------------------------------------------- */

    function calcularCaixaConteudo() {
        var larguraFisica = canvas.width;
        var alturaFisica = canvas.height;

        if (!larguraFisica || !alturaFisica) {
            return null;
        }

        // o recorte é feito pelos pixels realmente visíveis, então a borracha
        // e áreas vazias não deixam margens sobrando na imagem exportada
        var dados = ctx.getImageData(0, 0, larguraFisica, alturaFisica).data;
        var minX = larguraFisica;
        var minY = alturaFisica;
        var maxX = -1;
        var maxY = -1;

        for (var y = 0; y < alturaFisica; y++) {
            var inicioLinha = y * larguraFisica * 4;

            for (var x = 0; x < larguraFisica; x++) {
                if (dados[inicioLinha + x * 4 + 3] > 4) {
                    if (x < minX) {
                        minX = x;
                    }

                    if (x > maxX) {
                        maxX = x;
                    }

                    if (y < minY) {
                        minY = y;
                    }

                    if (y > maxY) {
                        maxY = y;
                    }
                }
            }
        }

        if (maxX < 0 || maxY < 0) {
            return null;
        }

        var dpr = estado.dpr || 1;
        var respiro = 14;
        var largura = estado.largura || larguraFisica / dpr;
        var altura = estado.altura || alturaFisica / dpr;
        var xInicial = Math.max(0, minX / dpr - respiro);
        var yInicial = Math.max(0, minY / dpr - respiro);
        var xFinal = Math.min(largura, (maxX + 1) / dpr + respiro);
        var yFinal = Math.min(altura, (maxY + 1) / dpr + respiro);

        return {
            x: xInicial,
            y: yInicial,
            w: Math.max(1, xFinal - xInicial),
            h: Math.max(1, yFinal - yInicial)
        };
    }

    function corDeFundoDoCanvas() {
        if (divCanvas) {
            var cor = window.getComputedStyle(divCanvas).backgroundColor;

            if (cor && cor !== 'transparent' && cor !== 'rgba(0, 0, 0, 0)') {
                return cor;
            }
        }

        var fallback = window.getComputedStyle(document.documentElement).getPropertyValue('--WhiteDraw').trim();

        return fallback || '#ffffff';
    }

    function criarCanvasExportacao(comFundo) {
        var caixa = calcularCaixaConteudo();

        if (!caixa) {
            return null;
        }

        var escala = Math.max(2, Math.min(3, estado.dpr || 1));
        var larguraFinal = caixa.w;
        var alturaFinal = caixa.h;
        var deslocamentoX = 0;
        var deslocamentoY = 0;

        // deixa a imagem numa proporção confortável para a cápsula da área de trabalho
        if (larguraFinal / alturaFinal > ASPECTO_MAXIMO) {
            var novaAltura = larguraFinal / ASPECTO_MAXIMO;
            deslocamentoY = (novaAltura - alturaFinal) / 2;
            alturaFinal = novaAltura;
        } else if (alturaFinal / larguraFinal > ASPECTO_MAXIMO) {
            var novaLargura = alturaFinal / ASPECTO_MAXIMO;
            deslocamentoX = (novaLargura - larguraFinal) / 2;
            larguraFinal = novaLargura;
        }

        var saida = document.createElement('canvas');
        saida.width = Math.max(1, Math.round(larguraFinal * escala));
        saida.height = Math.max(1, Math.round(alturaFinal * escala));

        var saidaCtx = saida.getContext('2d');
        saidaCtx.imageSmoothingEnabled = true;

        if ('imageSmoothingQuality' in saidaCtx) {
            saidaCtx.imageSmoothingQuality = 'high';
        }

        // o envio para a área de trabalho recebe um fundo opaco para não
        // deixar as cápsulas de trás aparecerem através do desenho
        if (comFundo) {
            saidaCtx.fillStyle = corDeFundoDoCanvas();
            saidaCtx.fillRect(0, 0, saida.width, saida.height);
        }

        saidaCtx.drawImage(
            canvas,
            caixa.x * estado.dpr,
            caixa.y * estado.dpr,
            caixa.w * estado.dpr,
            caixa.h * estado.dpr,
            Math.round(deslocamentoX * escala),
            Math.round(deslocamentoY * escala),
            Math.round(caixa.w * escala),
            Math.round(caixa.h * escala)
        );

        return saida;
    }

    function baixarImagem() {
        if (!estado.tracos.length) {
            mostrarToast('Desenhe algo antes de salvar.');
            return;
        }

        var imagem = criarCanvasExportacao(false);

        if (!imagem) {
            mostrarToast('Desenhe algo antes de salvar.');
            return;
        }

        var nome = window.prompt('Digite um nome para o arquivo:', 'desenho');

        if (nome === null) {
            return;
        }

        nome = String(nome).trim();

        if (!nome) {
            nome = 'desenho';
        }

        if (!/\.png$/i.test(nome)) {
            nome += '.png';
        }

        imagem.toBlob(function (blob) {
            if (!blob) {
                mostrarToast('Não foi possível salvar a imagem.');
                return;
            }

            var url = URL.createObjectURL(blob);
            var link = document.createElement('a');

            link.href = url;
            link.download = nome;
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.setTimeout(function () {
                URL.revokeObjectURL(url);
            }, 1500);

            mostrarToast('Imagem salva.');
        }, 'image/png');
    }

    function enviarParaAreaDeTrabalho() {
        if (!estado.tracos.length) {
            mostrarToast('Desenhe algo antes de enviar.');
            return;
        }

        if (typeof window.uploadImg !== 'function') {
            mostrarToast('A área de trabalho não está disponível.');
            return;
        }

        var imagem = criarCanvasExportacao(true);

        if (!imagem) {
            mostrarToast('Desenhe algo antes de enviar.');
            return;
        }

        try {
            var url = imagem.toDataURL('image/png');

            window.uploadImg(url, imagem.height, imagem.width, 'DESENHO');
            mostrarToast('Desenho enviado para a área de trabalho!');

            // fecha a gaveta para a pessoa ver a cápsula recém-criada
            window.setTimeout(function () {
                if (typeof window.openDraw === 'function' && typeof window.openDra !== 'undefined' && window.openDra === 1) {
                    window.openDraw();
                }

                mostrarAvisoGlobal('Desenho enviado para a área de trabalho!');
            }, 550);
        } catch (e) {
            mostrarToast('Não foi possível enviar o desenho.');
        }
    }

    function mostrarAvisoGlobal(mensagem) {
        if (typeof window.mostrarAlertaGlobal === 'function') {
            window.mostrarAlertaGlobal(mensagem, 3200);
            return;
        }

        var alerta = document.getElementById('BTNAlerta');

        if (!alerta || !alerta.firstElementChild) {
            return;
        }

        alerta.firstElementChild.innerHTML = mensagem;
        alerta.style.display = 'initial';
        window.clearTimeout(window.__alertaGlobalTimer);

        window.__alertaGlobalTimer = window.setTimeout(function () {
            alerta.style.display = 'none';
        }, 3200);
    }

    function mostrarToast(mensagem) {
        if (!toast) {
            return;
        }

        toast.textContent = mensagem;
        toast.classList.add('show');
        window.clearTimeout(estado.toastTimer);

        estado.toastTimer = window.setTimeout(function () {
            toast.classList.remove('show');
        }, 2600);
    }

    /* ---------------------------------------------------------------
     * Botões e atalhos
     * ------------------------------------------------------------- */

    function configurarAcoes() {
        if (btnUndo) {
            btnUndo.addEventListener('click', desfazer);
        }

        if (btnRedo) {
            btnRedo.addEventListener('click', refazer);
        }

        var btnLimpar = document.getElementById('drawClear');

        if (btnLimpar) {
            btnLimpar.addEventListener('click', limparCanvas);
        }
    }

    function configurarAtalhos() {
        document.addEventListener('keydown', function (evento) {
            if (typeof window.openDra !== 'undefined' && !window.openDra) {
                return;
            }

            var alvo = evento.target;

            if (alvo && (alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA' || alvo.isContentEditable)) {
                return;
            }

            var ctrl = evento.ctrlKey || evento.metaKey;
            var tecla = String(evento.key).toLowerCase();

            if (ctrl && tecla === 'z') {
                evento.preventDefault();

                if (evento.shiftKey) {
                    refazer();
                } else {
                    desfazer();
                }

                return;
            }

            if (ctrl && tecla === 'y') {
                evento.preventDefault();
                refazer();
                return;
            }

            if (ctrl || evento.altKey) {
                return;
            }

            var atalhos = {
                p: 'pen',
                h: 'highlighter',
                e: 'eraser',
                l: 'line',
                r: 'rect',
                o: 'ellipse',
                a: 'arrow'
            };

            if (atalhos[tecla]) {
                evento.preventDefault();
                definirFerramenta(atalhos[tecla]);
            }
        });
    }

    /* ---------------------------------------------------------------
     * Exposição para os botões do HTML
     * ------------------------------------------------------------- */

    window.changeSize = function (valor) {
        definirTamanho(valor, true);
    };

    window.clearCanvas = limparCanvas;
    window.download_img = baixarImagem;
    window.send_img = enviarParaAreaDeTrabalho;
    window.ajustarCanvasDesenho = ajustarCanvas;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }
})();
