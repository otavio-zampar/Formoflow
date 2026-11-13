/* Configurações do site: popup, tema, plano de fundo, idioma e cookies. */
(function () {
    'use strict';

    var CHAVE_PREFERENCIAS = 'preferencias';
    var CHAVE_WORKSPACE = 'workspace';

    var estado = {
        tema: 1,
        fundo: 'grid',
        idioma: 'PT-BR',
        cor: '#0FF',
        popupAberto: false
    };

    function lerPreferencias() {
        var padrao = {
            tema: 1,
            fundo: 'grid',
            idioma: 'PT-BR',
            cor: '#0FF'
        };

        if (!window.Store) {
            return padrao;
        }

        var salvo = window.Store.get(CHAVE_PREFERENCIAS, padrao);

        if (typeof salvo !== 'object' || !salvo) {
            return padrao;
        }

        var tema = Number(salvo.tema);
        if (!tema || tema < 1 || tema > 6) {
            tema = padrao.tema;
        }

        return {
            tema: tema,
            fundo: ['grid', 'dots', 'plain'].indexOf(salvo.fundo) >= 0 ? salvo.fundo : padrao.fundo,
            idioma: ['PT-BR', 'EN-US', 'SP-MX'].indexOf(salvo.idioma) >= 0 ? salvo.idioma : padrao.idioma,
            cor: typeof salvo.cor === 'string' ? salvo.cor : padrao.cor
        };
    }

    function salvarPreferencias() {
        if (!window.Store) {
            return;
        }

        window.Store.set(CHAVE_PREFERENCIAS, estado);
    }

    function sincronizarGlobaisTema() {
        if (typeof window.tema !== 'undefined') {
            window.tema = estado.tema;
        }

        if (typeof window.dark !== 'undefined') {
            // Temas 2 a 6 são escuros para efeito de criação de cards.
            window.dark = estado.tema === 1 ? 1 : 2;
        }

        if (estado.tema >= 3 && estado.tema <= 6) {
            if (typeof window.hc !== 'undefined') {
                window.hc = estado.tema;
            }
        }

        var opcoes = document.querySelectorAll('[data-tema-option]');

        Array.prototype.forEach.call(opcoes, function (botao) {
            var ativo = Number(botao.getAttribute('data-tema-option')) === estado.tema;
            botao.classList.toggle('active', ativo);
            botao.setAttribute('aria-pressed', ativo ? 'true' : 'false');
        });
    }

    function aplicarTema() {
        if (typeof window.mudaTema === 'function') {
            window.mudaTema(estado.tema);
        }

        sincronizarGlobaisTema();
    }

    function aplicarFundo() {
        var background = document.getElementById('background');

        if (background) {
            background.classList.remove('bg-grid', 'bg-dots', 'bg-plain');
            background.classList.add('bg-' + estado.fundo);
        }

        var opcoes = document.querySelectorAll('[data-bg-option]');

        Array.prototype.forEach.call(opcoes, function (botao) {
            var ativo = botao.getAttribute('data-bg-option') === estado.fundo;
            botao.classList.toggle('active', ativo);
            botao.setAttribute('aria-pressed', ativo ? 'true' : 'false');
        });

        atualizarPreviaFundo();
    }

    var TEXTOS_POPUP = {
        'PT-BR': {
            titulo: 'Configurações',
            tema: 'Tema',
            fundo: 'Plano de fundo',
            quadriculado: 'Quadriculado',
            pontilhado: 'Pontilhado',
            liso: 'Liso',
            cor: 'Cor de destaque',
            idioma: 'Idioma',
            limpar: 'Limpar dados salvos'
        },
        'EN-US': {
            titulo: 'Settings',
            tema: 'Theme',
            fundo: 'Background',
            quadriculado: 'Grid',
            pontilhado: 'Dots',
            liso: 'Plain',
            cor: 'Accent color',
            idioma: 'Language',
            limpar: 'Clear saved data'
        },
        'SP-MX': {
            titulo: 'Configuración',
            tema: 'Tema',
            fundo: 'Fondo',
            quadriculado: 'Cuadrícula',
            pontilhado: 'Puntos',
            liso: 'Liso',
            cor: 'Color de acento',
            idioma: 'Idioma',
            limpar: 'Borrar datos guardados'
        }
    };

    function aplicarTextoPopup() {
        var textos = TEXTOS_POPUP[estado.idioma] || TEXTOS_POPUP['PT-BR'];
        var popup = document.getElementById('settingsPopup');

        if (!popup) {
            return;
        }

        var titulo = popup.querySelector('.settingsTitle');
        var secaoTema = popup.querySelector('.settingsSection:nth-of-type(2) .settingsSectionTitle');
        var secaoFundo = popup.querySelector('.settingsSection:nth-of-type(3) .settingsSectionTitle');
        var secaoCor = popup.querySelector('.settingsSection:nth-of-type(4) .settingsSectionTitle');
        var secaoIdioma = popup.querySelector('.settingsSection:nth-of-type(5) .settingsSectionTitle');
        var limpar = document.getElementById('settingsClear');

        if (titulo) {
            titulo.textContent = textos.titulo;
        }
        if (secaoTema) {
            secaoTema.textContent = textos.tema;
        }
        if (secaoFundo) {
            secaoFundo.textContent = textos.fundo;
        }
        if (secaoCor) {
            secaoCor.textContent = textos.cor;
        }
        if (secaoIdioma) {
            secaoIdioma.textContent = textos.idioma;
        }
        if (limpar) {
            limpar.textContent = textos.limpar;
        }

        var fundos = popup.querySelectorAll('[data-bg-option]');
        Array.prototype.forEach.call(fundos, function (botao) {
            var valor = botao.getAttribute('data-bg-option');
            var texto = valor === 'grid' ? textos.quadriculado : (valor === 'dots' ? textos.pontilhado : textos.liso);
            botao.textContent = texto;
        });
    }

    function aplicarIdioma() {
        if (typeof window.linguagem !== 'undefined') {
            window.linguagem = estado.idioma;
        }

        if (typeof window.traducao !== 'function') {
            aplicarTextoPopup();
            return;
        }

        var elementos = Array.prototype.slice.call(document.getElementsByClassName('traduzir'))
            .concat(Array.prototype.slice.call(document.getElementsByClassName('traduzirPlaceholder')));

        var traducao;
        var dados;

        if (estado.idioma === 'EN-US' && typeof window.traducaoEnUs === 'function') {
            traducao = window.traducaoEnUs();
            dados = typeof window.dataEnUs === 'function' ? window.dataEnUs() : window.data;
        } else if (estado.idioma === 'SP-MX' && typeof window.traducaoSpMx === 'function') {
            traducao = window.traducaoSpMx();
            dados = typeof window.dataSpMx === 'function' ? window.dataSpMx() : window.data;
        } else {
            traducao = typeof window.traducaoPtBr === 'function' ? window.traducaoPtBr() : null;
            dados = typeof window.dataPtBr === 'function' ? window.dataPtBr() : window.data;
        }

        if (traducao) {
            window.traducao(elementos, traducao);
        }

        if (dados) {
            window.data = dados;
        }

        var lista = document.getElementById('outraLista');

        if (lista) {
            lista.innerHTML = '';
        }

        if (typeof window.criaListaCompleta === 'function' && window.data) {
            window.criaListaCompleta(window.data);
        }

        var opcoes = document.querySelectorAll('[data-idioma-option]');

        Array.prototype.forEach.call(opcoes, function (botao) {
            var ativo = botao.getAttribute('data-idioma-option') === estado.idioma;
            botao.classList.toggle('active', ativo);
            botao.setAttribute('aria-pressed', ativo ? 'true' : 'false');
        });

        aplicarTextoPopup();
    }

    function aplicarCor() {
        if (typeof window.customColor !== 'undefined') {
            window.customColor = estado.cor;
        }

        var seletor = document.getElementById('ColorHC');

        if (seletor) {
            seletor.value = estado.cor;
        }

        var seletorConfig = document.getElementById('settingsColor');
        if (seletorConfig) {
            seletorConfig.value = estado.cor;
        }

        if (estado.tema >= 3 && estado.tema <= 6) {
            aplicarCorCustomizada(estado.cor);
        } else {
            aplicarCorDestaque(estado.cor);
        }

        var opcoes = document.querySelectorAll('[data-tema-option]');

        Array.prototype.forEach.call(opcoes, function (botao) {
            var ativo = Number(botao.getAttribute('data-tema-option')) === estado.tema;
            botao.classList.toggle('active', ativo);
            botao.setAttribute('aria-pressed', ativo ? 'true' : 'false');
        });
    }

    function aplicarCorDestaque(cor) {
        // Nos temas claro e escuro todas as variáveis de cor pertencem ao tema.
        // A cor de destaque não sobrescreve nenhuma delas (antes trocava
        // --RealDarkBlueBTN e --AccentColorExtra e desalinhava a paleta).
        // A cor escolhida continua salva em estado.cor/customColor.
        var seletorDesenho = document.getElementById('ColPck');
        if (seletorDesenho) {
            // não sobrescreve a cor da caneta, apenas mantém referência se necessário
        }
    }

    function aplicarCorCustomizada(cor) {
        var raiz = document.documentElement;

        raiz.style.setProperty('--Black', cor);
        raiz.style.setProperty('--RealDarkBlueBTN', cor);
        raiz.style.setProperty('--BaseColor', cor);
        raiz.style.setProperty('--AccentColorBTN', cor);
        raiz.style.setProperty('--LightGrayBTN', cor);

        var corEscura = derivarCorEscura(cor);

        if (corEscura) {
            raiz.style.setProperty('--AccentColorExtra', corEscura);
            raiz.style.setProperty('--WhiteDraw', corEscura);
            raiz.style.setProperty('--textColorWindow', corEscura);
        }

        var seletorDesenho = document.getElementById('ColPck');

        if (seletorDesenho) {
            seletorDesenho.value = cor;
            seletorDesenho.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function derivarCorEscura(cor) {
        var hexadecimal = String(cor).replace('#', '');

        if (hexadecimal.length === 3) {
            hexadecimal = hexadecimal[0] + hexadecimal[0] + hexadecimal[1] + hexadecimal[1] + hexadecimal[2] + hexadecimal[2];
        }

        if (hexadecimal.length !== 6) {
            return '';
        }

        var resultado = '#';

        for (var i = 0; i < 6; i += 2) {
            var valor = Math.floor(parseInt(hexadecimal.substring(i, i + 2), 16) / 42.5 + 15);
            var trecho = valor.toString(16);

            if (trecho.length < 2) {
                trecho = '0' + trecho;
            }

            resultado += trecho;
        }

        return resultado;
    }

    function alternarPopup() {
        estado.popupAberto = !estado.popupAberto;

        var popup = document.getElementById('settingsPopup');
        var botao = document.getElementById('settingsFab');

        if (popup) {
            popup.hidden = !estado.popupAberto;
        }

        if (botao) {
            botao.setAttribute('aria-expanded', estado.popupAberto ? 'true' : 'false');
        }

        ativarDarker(estado.popupAberto);
    }

    function fecharPopup() {
        if (!estado.popupAberto) {
            return;
        }

        estado.popupAberto = false;

        var popup = document.getElementById('settingsPopup');
        var botao = document.getElementById('settingsFab');

        if (popup) {
            popup.hidden = true;
        }

        if (botao) {
            botao.setAttribute('aria-expanded', 'false');
        }

        ativarDarker(false);
    }

    function definirTema(valor) {
        var temaAnterior = estado.tema;

        estado.tema = Number(valor) || 1;

        if (estado.tema < 1 || estado.tema > 6) {
            estado.tema = 1;
        }

        if (estado.tema === 3) {
            estado.cor = '#00FFFF';
        } else if (estado.tema === 4) {
            estado.cor = '#FFFF00';
        } else if (estado.tema === 5) {
            estado.cor = '#FF00FF';
        } else if (estado.tema === 6) {
            estado.cor = '#FFFFFF';
        } else if (temaAnterior >= 3 && temaAnterior <= 6) {
            // Ao sair de um tema de alto contraste, a cor de destaque volta ao
            // padrão em vez de herdar o branco/ciano/amarelo do tema anterior.
            estado.cor = '#0FF';
        }

        aplicarTema();
        aplicarCor();
        salvarPreferencias();
    }

    function definirFundo(valor) {
        estado.fundo = valor;
        aplicarFundo();
        atualizarPreviaFundo();
        salvarPreferencias();
    }

    function definirIdioma(valor) {
        estado.idioma = valor;
        aplicarIdioma();
        salvarPreferencias();
    }

    function definirCor(valor) {
        estado.cor = String(valor || '#0FF');
        aplicarCor();
        salvarPreferencias();
    }

    function limparDados() {
        if (!window.Store) {
            return;
        }

        if (!window.confirm('Limpar cards, desenhos e preferências salvas?')) {
            return;
        }

        // Evita que o beforeunload regrave os cards que acabaram de ser apagados.
        window.ignorarProximoAutosave = true;

        window.Store.remove(CHAVE_PREFERENCIAS);
        window.Store.remove(CHAVE_WORKSPACE);

        window.location.reload();
    }

    function vincularEventos() {
        var botaoAbrir = document.getElementById('settingsFab');
        var botaoFechar = document.getElementById('settingsClose');

        if (botaoAbrir) {
            botaoAbrir.addEventListener('click', function (evento) {
                evento.stopPropagation();
                alternarPopup();
            });
        }

        if (botaoFechar) {
            botaoFechar.addEventListener('click', function () {
                fecharPopup();
            });
        }

        document.addEventListener('click', function (evento) {
            var popup = document.getElementById('settingsPopup');
            var alvo = evento.target;

            if (!estado.popupAberto || !popup) {
                return;
            }

            if (!popup.contains(alvo) && alvo.id !== 'settingsFab' && !document.getElementById('settingsFab').contains(alvo)) {
                fecharPopup();
            }
        });

        document.addEventListener('keydown', function (evento) {
            if (evento.key === 'Escape') {
                fecharPopup();
            }
        });

        var temas = document.querySelectorAll('[data-tema-option]');
        Array.prototype.forEach.call(temas, function (botao) {
            botao.addEventListener('click', function () {
                definirTema(botao.getAttribute('data-tema-option'));
            });
        });

        var fundos = document.querySelectorAll('[data-bg-option]');
        Array.prototype.forEach.call(fundos, function (botao) {
            botao.addEventListener('click', function () {
                definirFundo(botao.getAttribute('data-bg-option'));
            });
        });

        var idiomas = document.querySelectorAll('[data-idioma-option]');
        Array.prototype.forEach.call(idiomas, function (botao) {
            botao.addEventListener('click', function () {
                definirIdioma(botao.getAttribute('data-idioma-option'));
            });
        });

        var cor = document.getElementById('settingsColor');
        if (cor) {
            cor.addEventListener('input', function () {
                definirCor(this.value);
            });
        }

        var limpar = document.getElementById('settingsClear');
        if (limpar) {
            limpar.addEventListener('click', limparDados);
        }

        var fundoPreview = document.getElementById('settingsBgPreview');
        if (fundoPreview) {
            fundoPreview.setAttribute('data-bg', estado.fundo);
        }
    }

    function atualizarPreviaFundo() {
        var fundoPreview = document.getElementById('settingsBgPreview');

        if (fundoPreview) {
            fundoPreview.setAttribute('data-bg', estado.fundo);
        }
    }

    function algumPainelAberto() {
        return (typeof openCal !== 'undefined' && openCal === 1)
            || (typeof openDra !== 'undefined' && openDra === 1)
            || (typeof openImp !== 'undefined' && openImp === 1);
    }

    function ativarDarker(ativo) {
        var darker = document.getElementById('darker');

        if (!darker) {
            return;
        }

        if (ativo) {
            darker.style.backgroundColor = '#00000050';
            darker.style.pointerEvents = 'auto';
        } else if (!algumPainelAberto() && !estado.popupAberto) {
            darker.style.backgroundColor = '#00000000';
            darker.style.pointerEvents = 'none';
        }
    }

    function montarPopup() {
        if (document.getElementById('settingsPopup')) {
            return;
        }

        if (!document.body) {
            window.setTimeout(montarPopup, 60);
            return;
        }

        var popup = document.createElement('div');
        popup.id = 'settingsPopup';
        popup.hidden = true;
        popup.setAttribute('role', 'dialog');
        popup.setAttribute('aria-label', 'Configurações');
        popup.innerHTML = [
            '<div class="settingsHeader">',
            '    <h2 class="settingsTitle">Configurações</h2>',
            '    <button type="button" id="settingsClose" class="settingsClose" aria-label="Fechar configurações">',
            '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
            '    </button>',
            '</div>',
            '<div class="settingsSection">',
            '    <p class="settingsSectionTitle">Tema</p>',
            '    <div class="settingsRow">',
            '        <button type="button" class="settingsChoice" data-tema-option="1">Claro</button>',
            '        <button type="button" class="settingsChoice" data-tema-option="2">Escuro</button>',
            '        <button type="button" class="settingsChoice" data-tema-option="6">AMOLED</button>',
            '    </div>',
            '    <div class="settingsRow">',
            '        <button type="button" class="settingsChoice" data-tema-option="3">HC Ciano</button>',
            '        <button type="button" class="settingsChoice" data-tema-option="4">HC Amarelo</button>',
            '        <button type="button" class="settingsChoice" data-tema-option="5">HC Magenta</button>',
            '    </div>',
            '</div>',
            '<div class="settingsSection">',
            '    <p class="settingsSectionTitle">Plano de fundo</p>',
            '    <div class="settingsPreview" id="settingsBgPreview" data-bg="grid" aria-hidden="true"></div>',
            '    <div class="settingsRow">',
            '        <button type="button" class="settingsChoice" data-bg-option="grid">Quadriculado</button>',
            '        <button type="button" class="settingsChoice" data-bg-option="dots">Pontilhado</button>',
            '        <button type="button" class="settingsChoice" data-bg-option="plain">Liso</button>',
            '    </div>',
            '</div>',
            '<div class="settingsSection">',
            '    <p class="settingsSectionTitle">Cor de destaque</p>',
            '    <div class="settingsColor">',
            '        <input type="color" id="settingsColor" value="#0FF" aria-label="Cor de destaque">',
            '    </div>',
            '</div>',
            '<div class="settingsSection">',
            '    <p class="settingsSectionTitle">Idioma</p>',
            '    <div class="settingsRow">',
            '        <button type="button" class="settingsChoice" data-idioma-option="PT-BR">Português</button>',
            '        <button type="button" class="settingsChoice" data-idioma-option="EN-US">English</button>',
            '        <button type="button" class="settingsChoice" data-idioma-option="SP-MX">Español</button>',
            '    </div>',
            '</div>',
            '<div class="settingsSection">',
            '    <button type="button" id="settingsClear" class="settingsDanger">Limpar dados salvos</button>',
            '</div>'
        ].join('');

        document.body.appendChild(popup);
    }

    function iniciar() {
        var preferencias = lerPreferencias();

        estado.tema = preferencias.tema;
        estado.fundo = preferencias.fundo;
        estado.idioma = preferencias.idioma;
        estado.cor = preferencias.cor;

        montarPopup();
        aplicarFundo();
        aplicarTextoPopup();

        var preview = document.getElementById('settingsBgPreview');
        if (preview) {
            preview.setAttribute('data-bg', estado.fundo);
        }

        vincularEventos();

        window.addEventListener('load', function () {
            montarPopup();

            try {
                aplicarTema();
            } catch (e) {
                // o header ainda pode não ter sido carregado
            }

            aplicarIdioma();
            aplicarCor();
        });
    }

    window.Settings = {
        get estado() {
            return estado;
        },
        salvarPreferencias: salvarPreferencias,
        aplicarTema: aplicarTema,
        aplicarFundo: aplicarFundo,
        aplicarIdioma: aplicarIdioma,
        aplicarCor: aplicarCor,
        definirTema: definirTema,
        definirFundo: definirFundo,
        definirIdioma: definirIdioma,
        definirCor: definirCor,
        limparDados: limparDados,
        iniciarAposHeader: function () {
            montarPopup();
            aplicarFundo();
            aplicarTextoPopup();
            aplicarIdioma();

            try {
                aplicarTema();
            } catch (e) {
                // tema será aplicado no load
            }

            // A cor de destaque precisa ser aplicada depois do tema para não
            // ser sobrescrita pelos valores padrão do tema.
            aplicarCor();

            vincularEventos();

            window.setTimeout(aplicarIdioma, 300);
            window.setTimeout(aplicarIdioma, 1200);
        },
        CHAVE_PREFERENCIAS: CHAVE_PREFERENCIAS,
        CHAVE_WORKSPACE: CHAVE_WORKSPACE
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }
})();
