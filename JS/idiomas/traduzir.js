function traducao(elementos, lingua){
    elementos.forEach((element, index) => {
        if (element.classList.contains('traduzir')) { // tds os elementos q usam innerHTML
            // console.log(element.innerHTML+", "+ lingua[index]);
            element.innerHTML = lingua[index];
        } else { //placeholder
            // console.log(element.placeholder+", "+ lingua[index]);
            element.placeholder = lingua[index];
        }
    });
    console.log(elementos.length);
}

function traducaoPtBr(){

    return [
        'Copiado!',
        'Contato',
        'Salvar',
        'Mandar para a àrea de Trabalho',
        'CONTATO',
        'Elogios? <a href="mailto:contato@formoflow.com.br" class="contato">contato@formoflow.com.br</a>',
        'Dúvidas? <a href="mailto:suporte@formoflow.com.br" class="contato">suporte@formoflow.com.br</a>',
        'SAC: <a href="mailto:sac@formoflow.com.br" class="contato">sac@formoflow.com.br</a>',
        'Pesquisar...'
    ];
}

function traducaoEnUs(){
    return [
        'Copied!',
        'Contact',
        'Save',
        'Send to Desktop',
        'CONTACT',
        'Compliments? <a href="mailto:contato@formoflow.com.br" class="contato">contato@formoflow.com.br</a>',
        'Questions? <a href="mailto:suporte@formoflow.com.br" class="contato">suporte@formoflow.com.br</a>',
        'Customer Service: <a href="mailto:sac@formoflow.com.br" class="contato">sac@formoflow.com.br</a>',
        
        'Search...'
    ];
    
}

function traducaoSpMx(){
    return [
        '¡Copiado!',
        'Contacto',
        'Guardar',
        'Enviar al área de trabajo',
        'CONTACTO',
        '¿Elogios? <a href="mailto:contato@formoflow.com.br" class="contato">contato@formoflow.com.br</a>',
        '¿Dudas? <a href="mailto:suporte@formoflow.com.br" class="contato">suporte@formoflow.com.br</a>',
        'SAC: <a href="mailto:sac@formoflow.com.br" class="contato">sac@formoflow.com.br</a>',
        'Buscar...'
    ];
}