/* Armazenamento local: cookies (com fallback para localStorage).
 * Os cookies têm limite pequeno, então valores grandes são divididos em
 * blocos e, se ainda assim não couberem, usamos localStorage como apoio. */
(function () {
    'use strict';

    var PREFIXO = 'ff_';
    var DIAS = 365;
    var MAX_COOKIE = 3800;

    function escapar(valor) {
        return encodeURIComponent(String(valor));
    }

    function desescapar(valor) {
        try {
            return decodeURIComponent(valor);
        } catch (e) {
            return valor;
        }
    }

    function cookiePermitido() {
        try {
            return navigator.cookieEnabled !== false;
        } catch (e) {
            return true;
        }
    }

    function setarCookie(nome, valor, dias) {
        var expiracao = '';
        var mesmoSite = 'SameSite=Lax';

        if (dias) {
            var data = new Date();
            data.setTime(data.getTime() + dias * 24 * 60 * 60 * 1000);
            expiracao = '; expires=' + data.toUTCString();
        }

        var parte = escapar(nome) + '=' + valor + expiracao + '; path=/; ' + mesmoSite;
        var seguro = location.protocol === 'https:' ? '; Secure' : '';

        document.cookie = parte + seguro;
    }

    function lerCookie(nome) {
        if (!cookiePermitido()) {
            return null;
        }

        var prefixo = escapar(nome) + '=';
        var cookies = document.cookie ? document.cookie.split(';') : [];

        for (var i = 0; i < cookies.length; i++) {
            var bruto = cookies[i].replace(/^\s+/, '');

            if (bruto.indexOf(prefixo) === 0) {
                return bruto.substring(prefixo.length);
            }
        }

        return null;
    }

    function removerCookie(nome) {
        setarCookie(nome, '', -1);
    }

    function localStorageDisponivel() {
        try {
            var teste = '__ff_teste__';
            window.localStorage.setItem(teste, '1');
            window.localStorage.removeItem(teste);
            return true;
        } catch (e) {
            return false;
        }
    }

    function gravarJson(nome, dados) {
        var json = JSON.stringify(dados);
        var codificado = encodeURIComponent(json);

        if (!cookiePermitido()) {
            return gravarLocal(nome, json);
        }

        var blocos = [];
        var posicao = 0;

        while (posicao < codificado.length) {
            blocos.push(codificado.substring(posicao, posicao + MAX_COOKIE));
            posicao += MAX_COOKIE;
        }

        if (blocos.length === 0) {
            blocos.push('');
        }

        var cabecalho = JSON.stringify({ blocos: blocos.length, versao: 1 });

        if (cabecalho.length + 100 > MAX_COOKIE || blocos.length > 4) {
            return gravarLocal(nome, json);
        }

        removerBlocos(nome, blocos.length);

        setarCookie(PREFIXO + nome, cabecalho, DIAS);

        for (var i = 0; i < blocos.length; i++) {
            setarCookie(PREFIXO + nome + '_' + i, blocos[i], DIAS);
        }

        // Se os dados voltaram a caber em cookies, descarta o fallback antigo.
        if (lerCookie(PREFIXO + nome) !== null) {
            removerCookie(PREFIXO + nome + '_local');

            if (localStorageDisponivel()) {
                try {
                    window.localStorage.removeItem(PREFIXO + nome);
                } catch (e) {
                    // ignora
                }
            }
        }

        return true;
    }

    function removerBlocos(nome, quantidade) {
        for (var i = 0; i < quantidade + 2; i++) {
            removerCookie(PREFIXO + nome + '_' + i);
        }
    }

    function removerCookies(nome) {
        var cabecalho = lerCookie(PREFIXO + nome);
        var quantidade = 4;

        removerCookie(PREFIXO + nome);
        removerCookie(PREFIXO + nome + '_local');

        if (cabecalho) {
            try {
                var info = JSON.parse(desescapar(cabecalho));

                if (info && info.blocos) {
                    quantidade = Number(info.blocos) || 4;
                }
            } catch (e) {
                quantidade = 4;
            }
        }

        removerBlocos(nome, quantidade);
    }

    function gravarLocal(nome, json) {
        if (!localStorageDisponivel()) {
            return false;
        }

        try {
            window.localStorage.setItem(PREFIXO + nome, json);

            // O cookie antigo não pode continuar tendo prioridade na leitura.
            removerCookies(nome);
            setarCookie(PREFIXO + nome + '_local', '1', DIAS);
            return true;
        } catch (e) {
            return false;
        }
    }

    function lerLocal(nome) {
        if (!localStorageDisponivel()) {
            return null;
        }

        try {
            return window.localStorage.getItem(PREFIXO + nome);
        } catch (e) {
            return null;
        }
    }

    function lerJson(nome, padrao) {
        if (!cookiePermitido()) {
            return lerLocalOuPadrao(nome, padrao);
        }

        // Depois que o workspace cresce, o localStorage passa a ser a fonte oficial.
        if (lerCookie(PREFIXO + nome + '_local')) {
            var localMarcado = lerLocal(nome);

            if (localMarcado !== null) {
                return decodificarJson(localMarcado, padrao);
            }
        }

        var cabecalho = lerCookie(PREFIXO + nome);

        if (!cabecalho) {
            return lerLocalOuPadrao(nome, padrao);
        }

        try {
            var info = JSON.parse(desescapar(cabecalho));

            if (typeof info === 'object' && info && info.blocos) {
                var partes = [];

                for (var i = 0; i < info.blocos; i++) {
                    var parte = lerCookie(PREFIXO + nome + '_' + i);

                    if (parte === null) {
                        return lerLocalOuPadrao(nome, padrao);
                    }

                    partes.push(parte);
                }

                return decodificarJson(partes.join(''), padrao);
            }
        } catch (e) {
            // cabeçalho corrompido: tenta o fallback
        }

        return lerLocalOuPadrao(nome, padrao);
    }

    function lerLocalOuPadrao(nome, padrao) {
        var local = lerLocal(nome);

        if (local !== null) {
            return decodificarJson(local, padrao);
        }

        return padrao;
    }

    function decodificarJson(valor, padrao) {
        try {
            var bruto = decodeURIComponent(valor);
            return JSON.parse(bruto);
        } catch (e) {
            try {
                return JSON.parse(valor);
            } catch (e2) {
                return padrao;
            }
        }
    }

    function remover(nome) {
        removerCookies(nome);

        if (localStorageDisponivel()) {
            try {
                window.localStorage.removeItem(PREFIXO + nome);
            } catch (e) {
                // ignora
            }
        }
    }

    window.Store = {
        get: lerJson,
        set: gravarJson,
        remove: remover,
        getRaw: function (nome, padrao) {
            return lerLocal(nome) !== null ? lerLocal(nome) : (lerCookie(PREFIXO + nome) || padrao);
        },
        setRaw: function (nome, valor) {
            return gravarJson(nome, valor);
        }
    };
})();
