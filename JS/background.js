function criaBckgnd(tst) {
    var container = document.getElementById('container');
    var bg = $('#background');

    if (!container || bg.length === 0) {
        return;
    }

    bg.empty();

    var largura = container.clientWidth;
    var altura = container.clientHeight;

    if (!largura || !altura) {
        largura = window.innerWidth || 0;
        altura = (window.innerHeight || 0) - 100;
    }

    var limite = typeof tst === 'number' ? tst : Infinity;
    var maxHorizontal = Math.min(Math.floor(altura / 10), limite);
    var maxVertical = Math.min(Math.floor(largura / 10), limite);

    for (var i = 0; i <= maxHorizontal; i++) {
        var top = i * 10;
        if (top > altura) {
            break;
        }
        bg.append($('<div>').addClass('linha-horizontal opaque').css('top', top + 'px'));
    }

    for (var j = 0; j <= maxVertical; j++) {
        var left = j * 10;
        if (left > largura) {
            break;
        }
        bg.append($('<div>').addClass('linha-vertical opaque').css('left', left + 'px'));
    }
}