// Avaliador de expressões da calculadora.
// A versão antiga montava a expressão com replace() e eval(), o que quebrava
// parênteses, potências e raízes. Agora usamos um parser recursivo simples,
// que respeita a precedência dos operadores e as funções disponíveis na UI.

function tokenizarExpressao(input) {
    var tokens = [];
    var i = 0;

    while (i < input.length) {
        var ch = input[i];

        // espaços são ignorados
        if (/\s/.test(ch)) {
            i++;
            continue;
        }

        // constante pi
        if (ch === 'π') {
            tokens.push({ type: 'identificador', value: 'π' });
            i++;
            continue;
        }

        // raiz quadrada é um operador unário
        if (ch === '√') {
            tokens.push({ type: 'operador', value: '√' });
            i++;
            continue;
        }

        // números: decimais com . ou ,, notação científica e bases 0x/0b/0o
        if (/[0-9.]/.test(ch)) {
            var restante = input.substring(i);
            var baseMatch = restante.match(/^0[xX][0-9a-fA-F]+|^0[bB][01]+|^0[oO][0-7]+/);

            if (baseMatch) {
                tokens.push({ type: 'numero', value: Number(baseMatch[0]) });
                i += baseMatch[0].length;
                continue;
            }

            var numeroMatch = restante.match(/^(?:\d+(?:[.,]\d+)*|\.\d+)(?:[eE][+-]?\d+)?/);

            if (!numeroMatch) {
                throw new SyntaxError('Número inválido perto de "' + restante.substring(0, 10) + '"');
            }

            tokens.push({ type: 'numero', value: lerNumero(numeroMatch[0]) });
            i += numeroMatch[0].length;
            continue;
        }

        // nomes de funções e constantes
        if (/[A-Za-z]/.test(ch)) {
            var nomeMatch = input.substring(i).match(/^[A-Za-z][A-Za-z0-9_]*/);
            tokens.push({ type: 'identificador', value: nomeMatch[0] });
            i += nomeMatch[0].length;
            continue;
        }

        // operadores e parênteses
        if ('+-*/×÷^%!()'.indexOf(ch) !== -1) {
            tokens.push({ type: 'operador', value: ch });
            i++;
            continue;
        }

        throw new SyntaxError('Caractere inválido: "' + ch + '"');
    }

    return tokens;
}

// Aceita 1.5, 1,5, 1.000,50 e 1,000.50. O último separador encontrado é
// tratado como separador decimal e os demais como separadores de milhar.
function lerNumero(texto) {
    var expoente = '';
    var expMatch = texto.match(/[eE][+-]?\d+$/);

    if (expMatch) {
        expoente = expMatch[0];
        texto = texto.substring(0, texto.length - expoente.length);
    }

    var ultimoPonto = texto.lastIndexOf('.');
    var ultimaVirgula = texto.lastIndexOf(',');
    var separadorDecimal = Math.max(ultimoPonto, ultimaVirgula);

    var inteiro = separadorDecimal >= 0 ? texto.substring(0, separadorDecimal) : texto;
    var decimal = separadorDecimal >= 0 ? texto.substring(separadorDecimal + 1) : '';

    inteiro = inteiro.replace(/[.,]/g, '');
    decimal = decimal.replace(/[.,]/g, '');

    return Number(inteiro + (decimal !== '' ? '.' + decimal : '') + expoente);
}

// Converte valores digitados com vírgula decimal (ex.: "1,5") para o
// formato usado pelo eval das cápsulas.
function normalizarEntrada(valor) {
    var texto = String(valor).trim();

    if (/^[+-]?(?:\d+(?:[.,]\d+)*|\.\d+)(?:[eE][+-]?\d+)?$/.test(texto)) {
        var numero = lerNumero(texto);

        if (!isNaN(numero)) {
            return String(numero);
        }
    }

    return texto;
}

function fatorial(numero) {
    if (isNaN(numero) || !isFinite(numero)) {
        return NaN;
    }

    numero = Math.abs(Math.floor(numero));

    if (numero > 170) {
        return Infinity;
    }

    var resultado = 1;
    for (var i = 2; i <= numero; i++) {
        resultado *= i;
    }

    return resultado;
}

function modoAngular() {
    var elemento = typeof document !== 'undefined' && document.getElementById
        ? document.getElementById('switch2')
        : null;

    // O restante do projeto usa DEG como padrão.
    return elemento && elemento.innerHTML
        ? elemento.innerHTML.trim().toUpperCase()
        : 'DEG';
}

function paraRadianos(angulo) {
    return modoAngular() === 'DEG' ? (angulo * Math.PI) / 180 : angulo;
}

function limparResultado(valor, usouTrig) {
    if (typeof valor !== 'number') {
        return valor;
    }

    if (isNaN(valor)) {
        return NaN;
    }

    if (!isFinite(valor)) {
        return valor > 0 ? '∞' : '-∞';
    }

    // Math.sin(30°) e companhia geram valores como 0.4999999999999999.
    // Também removemos o ruído de contas como 0.1 + 0.2.
    if (usouTrig && Math.abs(valor) < 1e-12) {
        valor = 0;
    }

    var arredondado = Number(valor.toPrecision(15));

    return Object.is(arredondado, -0) ? 0 : arredondado;
}

function doEval(ansDoc) {
    if (typeof ansDoc === 'number') {
        return limparResultado(ansDoc, false);
    }

    if (ansDoc === undefined || ansDoc === null) {
        return '';
    }

    var expressao = String(ansDoc).trim();

    if (expressao === '') {
        return '';
    }

    // Fecha automaticamente os parênteses que ficaram abertos (ex.: "Sin(30").
    var parentesesAbertos = 0;
    for (var i = 0; i < expressao.length; i++) {
        if (expressao[i] === '(') {
            parentesesAbertos++;
        } else if (expressao[i] === ')') {
            parentesesAbertos--;

            if (parentesesAbertos < 0) {
                throw new SyntaxError('Parêntese fechado sem abrir.');
            }
        }
    }

    if (parentesesAbertos > 0) {
        expressao += ')'.repeat(parentesesAbertos);
    }

    var tokens = tokenizarExpressao(expressao);
    var posicao = 0;
    var usouTrig = false;

    function olhar() {
        return tokens[posicao];
    }

    function consumir() {
        return tokens[posicao++];
    }

    function ehOperador(valor) {
        var token = olhar();
        return token && token.type === 'operador' && token.value === valor;
    }

    function esperar(valor) {
        if (!ehOperador(valor)) {
            throw new SyntaxError('Era esperado "' + valor + '".');
        }

        return consumir();
    }

    function iniciaUmValor(token) {
        if (!token) {
            return false;
        }

        return token.type === 'numero'
            || token.type === 'identificador'
            || (token.type === 'operador' && (token.value === '(' || token.value === '√'));
    }

    function parseExpressao() {
        var valor = parseTermo();

        while (ehOperador('+') || ehOperador('-')) {
            var operador = consumir().value;
            var direita = parseTermo();
            valor = operador === '+' ? valor + direita : valor - direita;
        }

        return valor;
    }

    function parseTermo() {
        var valor = parseUnario();

        while (true) {
            if (ehOperador('*') || ehOperador('×')) {
                consumir();
                valor *= parseUnario();
            } else if (ehOperador('/') || ehOperador('÷')) {
                consumir();
                valor /= parseUnario();
            } else if (iniciaUmValor(olhar())) {
                // multiplicação implícita: 2π, 3√9, 2(3+4), (2+3)(4+5)
                valor *= parseUnario();
            } else {
                break;
            }
        }

        return valor;
    }

    function parseUnario() {
        if (ehOperador('+')) {
            consumir();
            return parseUnario();
        }

        if (ehOperador('-')) {
            consumir();
            return -parseUnario();
        }

        if (ehOperador('√')) {
            consumir();
            return Math.sqrt(parseUnario());
        }

        return parsePotencia();
    }

    function parsePotencia() {
        var base = parsePosfixo();

        if (ehOperador('^')) {
            consumir();
            // O expoente pode ser negativo e a potência é associativa à direita.
            return Math.pow(base, parseUnario());
        }

        return base;
    }

    function parsePosfixo() {
        var valor = parsePrimario();

        while (true) {
            if (ehOperador('!')) {
                consumir();
                valor = fatorial(valor);
            } else if (ehOperador('%')) {
                consumir();
                valor = valor / 100;
            } else {
                break;
            }
        }

        return valor;
    }

    function parsePrimario() {
        var token = consumir();

        if (!token) {
            throw new SyntaxError('Expressão incompleta.');
        }

        if (token.type === 'numero') {
            return token.value;
        }

        if (token.type === 'operador' && token.value === '(') {
            var valor = parseExpressao();
            esperar(')');
            return valor;
        }

        if (token.type === 'identificador') {
            var nome = token.value.toLowerCase();

            if (nome === 'π' || nome === 'pi') {
                return Math.PI;
            }

            if (nome === 'e') {
                return Math.E;
            }

            // permite escrever E2 ou pi2 como E * 2 e pi * 2
            var constanteMultiplicada = nome.match(/^(pi|e)(\d+)$/);
            if (constanteMultiplicada) {
                var constante = constanteMultiplicada[1] === 'pi' ? Math.PI : Math.E;
                return constante * Number(constanteMultiplicada[2]);
            }

            if (ehOperador('(')) {
                consumir();
                var argumento = parseExpressao();
                esperar(')');

                switch (nome) {
                    case 'sin':
                        usouTrig = true;
                        return Math.sin(paraRadianos(argumento));
                    case 'cos':
                        usouTrig = true;
                        return Math.cos(paraRadianos(argumento));
                    case 'tan':
                        usouTrig = true;
                        var tangente = Math.tan(paraRadianos(argumento));
                        // tan(90°) e tan(270°) são indefinidas; evitamos mostrar
                        // um número gigante por causa do arredondamento do JS.
                        return Math.abs(tangente) > 1e15 ? Infinity : tangente;
                    case 'log':
                        // O botão "Log" da calculadora é logaritmo na base 10.
                        return Math.log10(argumento);
                    case 'ln':
                        return Math.log(argumento);
                    case 'log10':
                        return Math.log10(argumento);
                    case 'log2':
                        return Math.log2(argumento);
                    case 'sqrt':
                        return Math.sqrt(argumento);
                    case 'abs':
                        return Math.abs(argumento);
                    case 'exp':
                        return Math.exp(argumento);
                    case 'floor':
                        return Math.floor(argumento);
                    case 'ceil':
                        return Math.ceil(argumento);
                    case 'round':
                        return Math.round(argumento);
                    default:
                        throw new SyntaxError('Função desconhecida: "' + token.value + '"');
                }
            }

            throw new SyntaxError('Nome desconhecido: "' + token.value + '"');
        }

        throw new SyntaxError('Token inesperado: "' + token.value + '"');
    }

    var resultado = parseExpressao();

    if (posicao < tokens.length) {
        throw new SyntaxError('Expressão inválida perto de "' + tokens[posicao].value + '".');
    }

    return limparResultado(resultado, usouTrig);
}
