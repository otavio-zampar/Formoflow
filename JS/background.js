function criaBckgnd(tst) {
    for (let i = 0; i <= tst; i++) {
        $('#container').append($('<div>').addClass('linha-horizontal opaque').css('top', i*10 +"px"));
    }
    for (let i = 0; i <= tst; i++) {
        $('#container').append($('<div>').addClass('linha-vertical opaque').css('left', i*10 +"px"));
    }
}