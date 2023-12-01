function traducao(elementos, lingua){
    elementos.forEach((element, index) => {
        if (element.classList.contains('traduzir')) { // tds os elementos q usam innerHTML
            // console.log(element.innerHTML);
            element.innerHTML = lingua[index];
        } else { //placeholder
            element.placeholder = lingua[index];
        }
    });
}

function traducaoPtBr(){

    return [
        'Copiado!',
        'Contato',
        'calculadora',
        'Resposta da calculadora ',
        'Histórico da calculadora',
        'Igual',
        'Parêntesis Esquerdo',
        'Parêntesis Direito',
        'Radiano',
        'Pi',
        'Euler',
        'Porcentagem',
        'Exponencial',
        'Logarímico',
        'Raíz quadrada',
        'Seno',
        'Cosseno',
        'Tangente',
        'Fatoral',
        'Upload de Imagem',
        'Área de desenho',
        'Range da Caneta',
        'Text da Caneta',
        'Cor da Caneta',
        'Salvar',
        'Mandar para a àrea de Trabalho',
        'Barra de pesquisa para fórmulas',
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
        'Calculator',
        'Calculator Response',
        'Calculator History',
        'Equals',
        'Left Parenthesis',
        'Right Parenthesis',
        'Radian',
        'Pi',
        'Euler',
        'Percentage',
        'Exponential',
        'Logarithmic',
        'Square Root',
        'Sine',
        'Cosine',
        'Tangent',
        'Factorial',
        'Image Upload',
        'Drawing Area',
        'Pen Range',
        'Pen Text',
        'Pen Color',
        'Save',
        'Send to Desktop',
        'Formula Search Bar',
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
        'calculadora',
        'Respuesta de la calculadora',
        'Historial de la calculadora',
        'Igual',
        'Paréntesis Izquierdo',
        'Paréntesis Derecho',
        'Radianes',
        'Pi',
        'Euler',
        'Porcentaje',
        'Exponencial',
        'Logarítmico',
        'Razón cuadrada',
        'Seno',
        'Coseno',
        'Tangente',
        'Factorial',
        'Cargar Imagen',
        'Área de Dibujo',
        'Rango del Bolígrafo',
        'Texto del Bolígrafo',
        'Color del Bolígrafo',
        'Guardar',
        'Enviar al área de trabajo',
        'Búsqueda de fórmulas',
        'CONTACTO',
        '¿Elogios? <a href="mailto:contato@formoflow.com.br" class="contato">contato@formoflow.com.br</a>',
        '¿Dudas? <a href="mailto:suporte@formoflow.com.br" class="contato">suporte@formoflow.com.br</a>',
        'SAC: <a href="mailto:sac@formoflow.com.br" class="contato">sac@formoflow.com.br</a>',
        'Buscar...'
    ];
}