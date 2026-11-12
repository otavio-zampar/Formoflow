/* Persistência do workspace (cards e desenhos) usando cookies/localStorage. */
(function () {
    'use strict';

    var CHAVE = 'workspace';
    var temporizador = 0;
    var restaurando = false;

    function debounceSalvar() {
        if (restaurando) {
            return;
        }

        window.clearTimeout(temporizador);
        temporizador = window.setTimeout(salvarWorkspace, 400);
    }

    function coletarWindows() {
        var janelas = [];

        document.querySelectorAll('.ActualDiv').forEach(function (elemento) {
            try {
                if (typeof window.saveJson === 'function') {
                    janelas.push(window.saveJson(elemento));
                }
            } catch (e) {
                // ignora cards corrompidos
            }
        });

        return janelas;
    }

    function salvarWorkspace() {
        if (!window.Store || restaurando) {
            return;
        }

        var dados = {
            versao: 1,
            windows: coletarWindows()
        };

        window.Store.set(CHAVE, dados);
    }

    function limparWorkspace() {
        document.querySelectorAll('.ActualDiv, .DraggableDiv').forEach(function (el) {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });

        if (typeof window.divCount !== 'undefined') {
            window.divCount = 0;
        }
        if (typeof window.ActualTop !== 'undefined') {
            window.ActualTop = 0;
        }
        if (typeof window.leftOffset !== 'undefined') {
            window.leftOffset = 0;
        }
        if (typeof window.highestZIndex !== 'undefined') {
            window.highestZIndex = 11;
        }
    }

    function encontrarAA(form, option) {
        if (typeof window.data === 'undefined' || !Array.isArray(window.data)) {
            return null;
        }

        for (var i = 0; i < window.data.length; i++) {
            var item = window.data[i];

            if (form && item.form === form) {
                return item;
            }

            if (option && item.option === option) {
                return item;
            }
        }

        return null;
    }

    function aplicarEstadoComum(id, win) {
        var card = document.getElementById(id);
        var drag = document.getElementById('draggable' + id);

        if (!card || !win || !win.atrr) {
            return;
        }

        if (win.atrr.left) {
            card.style.left = win.atrr.left;
            if (drag) drag.style.left = win.atrr.left;
        }
        if (win.atrr.top) {
            card.style.top = win.atrr.top;
            if (drag) drag.style.top = win.atrr.top;
        }
        if (win.atrr.width) {
            card.style.width = win.atrr.width;
            if (drag) drag.style.width = win.atrr.width;
            var tstDiv = card.querySelector('.tstDiv');
            if (tstDiv) tstDiv.style.width = win.atrr.width;
        }
        if (win.atrr.height) {
            card.style.height = win.atrr.height;
            var tstDivH = card.querySelector('.tstDiv');
            if (tstDivH) tstDivH.style.height = win.atrr.height;
        }
        if (win.atrr.zIndex) {
            card.style.zIndex = win.atrr.zIndex;
            if (drag) drag.style.zIndex = win.atrr.zIndex;
        }

        var tstDivC = card.querySelector('.tstDiv');
        if (tstDivC) {
            if (win.atrr.actualcolor) tstDivC.setAttribute('ActualColor', win.atrr.actualcolor);
            if (win.atrr.graycolor) tstDivC.setAttribute('GrayColor', win.atrr.graycolor);

            if (typeof dark !== 'undefined' && dark != 1 && win.atrr.graycolor) {
                tstDivC.style.backgroundColor = win.atrr.graycolor;
            } else if (win.atrr.actualcolor) {
                tstDivC.style.backgroundColor = win.atrr.actualcolor;
            }
        }
    }

    function restaurarWorkspace() {
        if (!window.Store) {
            return;
        }

        var dados = window.Store.get(CHAVE, null);

        if (!dados || !Array.isArray(dados.windows) || dados.windows.length === 0) {
            return;
        }

        restaurando = true;

        try {
            limparWorkspace();

            // primeira passada: cria os cards
            dados.windows.forEach(function (win) {
                try {
                    criarJanela(win);
                } catch (e) {
                    console.error('Erro ao restaurar janela', e, win);
                }
            });

            // segunda passada: aplica valores, links e saídas
            dados.windows.forEach(function (win) {
                try {
                    aplicarValores(win);
                } catch (e) {
                    console.error('Erro ao aplicar valores', e, win);
                }
            });
        } finally {
            restaurando = false;
        }

        // recalcula após restauração
        window.setTimeout(function () {
            document.querySelectorAll('.ActualDiv[actualname] .inputFormula').forEach(function (input) {
                if (typeof window.avaliarEntrada === 'function') {
                    window.avaliarEntrada(input);
                }
            });
        }, 50);
    }

    function criarJanela(win) {
        if (!win || !win.ActualDiv) {
            return;
        }

        var id = win.ActualDiv;
        var numero = parseInt(String(id).replace(/^div/, ''), 10) || 0;

        if (typeof window.divCount !== 'undefined') {
            window.divCount = Math.max(window.divCount, numero - 1);
        }

        if (win.imagem) {
            var largura = win.imagemW || 300;
            var altura = win.imagemH || 300;

            if (typeof window.uploadImg === 'function') {
                window.uploadImg(win.imagem, altura, largura, win.nomeImagem || '', { randomId: id, atrr: win.atrr });
                aplicarEstadoComum(id, win);
            }
            return;
        }

        if (win.function) {
            var aa = encontrarAA(win.function, win.name) || {
                option: win.name || win.function,
                form: win.function,
                qnt: win.input ? win.input.length : 0,
                exit: win.icon ? win.icon.length : 1,
                placeholder: []
            };

            // ajusta qnt/exit com base no salvo se necessário
            if (win.input) {
                aa.qnt = win.input.length;
            }
            if (win.icon) {
                aa.exit = win.icon.length;
            }

            if (typeof window.createDiv === 'function') {
                window.createDiv(aa, { randomId: id });
                aplicarEstadoComum(id, win);

                if (win.angleMode) {
                    var card = document.getElementById(id);
                    if (card) {
                        card.setAttribute('anglemode', win.angleMode);
                        var drag = document.getElementById('draggable' + id);
                        var toggle = drag ? drag.querySelector('.angleToggle') : null;
                        if (toggle) {
                            toggle.textContent = win.angleMode;
                            toggle.setAttribute('aria-label', win.angleMode === 'DEG' ? 'Ângulo em graus' : 'Ângulo em radianos');
                        }
                    }
                }
            }
            return;
        }

        // entrada (range/textarea)
        var aaRef = encontrarAA(null, win.name);
        var exit = Array.isArray(win.icon) ? win.icon.length : (win.exit !== undefined ? Number(win.exit) : 1);
        var tag = win.form || 'input';
        var tipo = (win.type !== undefined ? win.type : 'range');

        if (aaRef) {
            tag = win.form || aaRef.form || tag;
            tipo = (win.type !== undefined ? win.type : (aaRef.type !== undefined ? aaRef.type : tipo));
            if (aaRef.exit !== undefined) {
                exit = aaRef.exit;
            }
        } else if (win.form === 'textarea' || win.name === 'TUTORIAL' || exit === 0) {
            tag = win.form || 'textarea';
            tipo = (win.type !== undefined ? win.type : '');
            if (win.name === 'TUTORIAL') {
                exit = 0;
            }
        } else if (!win.form && !win.type) {
            // sem metadados salvos e sem referência: preserva como entrada de texto
            tag = 'textarea';
            tipo = '';
        }

        var aaEntrada = {
            option: win.name || 'Entrada',
            form: tag,
            type: tipo,
            qnt: 1,
            exit: exit
        };

        if (typeof window.createEntradaDiv === 'function') {
            window.createEntradaDiv(aaEntrada, { randomId: id });
            aplicarEstadoComum(id, win);
        }
    }

    function aplicarValores(win) {
        if (!win || !win.ActualDiv) {
            return;
        }

        var id = win.ActualDiv;

        if (Array.isArray(win.input)) {
            var inputs = document.querySelectorAll('#' + id + ' .inputFormula');

            win.input.forEach(function (info, index) {
                var input = inputs[index];

                if (!input) {
                    return;
                }

                if (info && typeof info === 'object') {
                    if (info.value !== undefined) {
                        input.value = info.value;
                    }
                    if (info.inputpai) {
                        input.setAttribute('InputPai', info.inputpai);
                    }
                    if (info['outline-color']) {
                        input.style.outlineColor = info['outline-color'];
                    }
                } else {
                    input.value = info;
                }
            });
        }

        if (Array.isArray(win.icon)) {
            var icons = document.querySelectorAll('#' + id + ' .icon');

            win.icon.forEach(function (valor, index) {
                if (icons[index]) {
                    icons[index].innerHTML = valor;
                }
            });
        }

        // nome de imagem
        if (win.nomeImagem) {
            var nome = document.querySelector('#draggable' + id + ' .hiddenName');
            if (nome) {
                nome.value = win.nomeImagem;
            }
        }
    }

    function agendarSalvarWorkspace() {
        debounceSalvar();
    }

    window.salvarWorkspace = salvarWorkspace;
    window.restaurarWorkspace = restaurarWorkspace;
    window.agendarSalvarWorkspace = agendarSalvarWorkspace;

    // auto-save
    document.addEventListener('input', debounceSalvar, true);
    document.addEventListener('change', debounceSalvar, true);
    document.addEventListener('mouseup', debounceSalvar, true);
    document.addEventListener('touchend', debounceSalvar, true);

    window.addEventListener('beforeunload', salvarWorkspace);
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') {
            salvarWorkspace();
        }
    });

    window.addEventListener('load', function () {
        // dá tempo para header/dados carregarem
        window.setTimeout(restaurarWorkspace, 400);
    });
})();
