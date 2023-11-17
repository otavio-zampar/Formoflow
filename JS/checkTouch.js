if ('ontouchstart' in window) {
    // O dispositivo suporta eventos de toque (é um dispositivo com tela sensível ao toque)
    
    document.getElementById('BTNAlerta').style.display = "initial";
    document.getElementById('BTNAlerta').firstElementChild.innerHTML = "Este site atualmente não suporta aparelhos mobile com suporte a toque na tela, use com cuidado.";
    setTimeout(() => {
    document.getElementById('BTNAlerta').style.display = "none";
    }, 10000);

  }