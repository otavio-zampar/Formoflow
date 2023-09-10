var divCount = 0;

function createDiv(nomeForm, actualName, inputForm) { // Bhaskhara, bhaskara, 3
    var randomId = 'div' + divCount++;
    var mini = 0;
    var ActualDiv = $('<div>').attr('id', randomId).addClass('ActualDiv');
    var DraggableDiv = $('<div>').attr('id', 'draggable' + randomId).addClass('DraggableDiv');
    var minimize = $('<div>').addClass('minimize');
    var CloseR = $('<div>').addClass('CloseR');
    var tstDiv = $('<div>').addClass('tstDiv');
    var ActualResizeHandle = $('<div>').addClass('resize-handle s ui-resizable-s'); // S
    var ActualResizeHandle2 = $('<div>').addClass('resize-handle e ui-resizable-e') // E
    var ActualResizeHandle3 = $('<div>').addClass('resize-handle w ui-resizable-w'); //.css('z-index', '0px'); // W


    var ActualResizeHandle4 = $('<div>').addClass('resize-handle se ui-resizable-se'); // SE
    var ActualResizeHandle5 = $('<div>').addClass('resize-handle sw ui-resizable-sw'); // SW

    {
        // cria o formulario
        var nome = $('<p>').text(nomeForm);
        var form = $('<form>');
        
        var inputElements = [];

        for (let index = 0; index < inputForm; index++) {
            var input = $('<input>').attr('type', 'text').attr('placeholder', 'Enter text').attr('id', "input"+divCount+index);
            inputElements.push(input); // Armazena a referência do elemento no array
            form.append(input);
        }
        var icon = $('<div>').addClass('icon').html('&#128515;'); // Unicode emoji for smiling face        

        form.on('input', function(event){
            event.preventDefault();
            
            var avaliacao = actualName+"(";
            for (let index = 0; index < inputForm; index++) {
                avaliacao += inputElements[index].val();
                if (index < inputForm-1) {
                    avaliacao += ", ";
                }
            }
            avaliacao += ")";

            try{
                // avaliacao = bhaskara(input.val(), input2.val(), input3.val())
                icon.text(eval(avaliacao));
            } catch(e){
                if (e instanceof SyntaxError) {
                    console.log("Erro de sintaxe (comum)");
                    // Faça algo para lidar com o erro de sintaxe, se necessário
                  } else {
                    // Outros tipos de erros que não são de sintaxe
                    console.error("Erro:", e);
                  }
            }
            
        });
    }

    $('body').append(ActualDiv);
    $('body').append(DraggableDiv);
    DraggableDiv.append(nome);
    DraggableDiv.append(minimize);
    DraggableDiv.append(CloseR);
    tstDiv.append(form);
    tstDiv.append(icon);
    ActualDiv.append(tstDiv);
    ActualDiv.append(ActualResizeHandle);
    ActualDiv.append(ActualResizeHandle2);
    ActualDiv.append(ActualResizeHandle3);

    ActualDiv.append(ActualResizeHandle4);
    ActualDiv.append(ActualResizeHandle5);

    ActualDiv.resizable({
        handles: {
            s: ".s",
            e: ".e",
            w: ".w",
            se: ".se",
            sw: ".sw",
        },
        minHeight: 300,
        minWidth: 300,
        resize: function(event, ui) {
            var actualWidth = ui.size.width;
            var actualHeight = ui.size.height;
            ui.originalLeft = ui.position.left;

            DraggableDiv.css('width', actualWidth);
            DraggableDiv.css('left', ui.originalLeft);
            ActualResizeHandle.css('width', actualWidth);
            ActualResizeHandle2.css('height', actualHeight);
            ActualResizeHandle3.css('height', actualHeight);
            tstDiv.css('width', actualWidth);
            tstDiv.css('height', actualHeight);
        }
    });

    DraggableDiv.draggable({
        containment: "#container",
        drag: function(event, ui) {
            var offset = ui.offset;
            var left = offset.left;
            var top = offset.top;

            $("#" + randomId).css({
                left: left,
                top: top
            });
        }
    });

    DraggableDiv.on('dragstart', function() {
        // Aumente o z-index da div ao clicar nela
        var highestZIndex = 10;

        // Encontre o maior z-index entre todas as divs visíveis
        $('.ActualDiv').each(function() {
            var zIndex = parseInt($(this).css('z-index'));
            if (!isNaN(zIndex) && zIndex > highestZIndex) {
                highestZIndex = zIndex;
            }
        });

        // Defina o z-index da div atual como o maior z-index + 1
        $(this).css('z-index', highestZIndex + 1);
        ActualDiv.css('z-index', highestZIndex + 1);
    });
    CloseR.on('mousedown', function(){

        $("#"+DraggableDiv.attr("id")).remove();
        $("#"+ActualDiv.attr("id")).remove();

    });

    minimize.on('mousedown', function(){
        if(mini == 0){
            ActualDiv.children().hide();
            mini = 1;
        }else{  
            ActualDiv.children().show();
            mini = 0;
            // Aumente o z-index da div ao clicar nela
            var highestZIndex = 10;

            // Encontre o maior z-index entre todas as divs visíveis
            $('.ActualDiv').each(function() {
                var zIndex = parseInt($(this).css('z-index'));
                if (!isNaN(zIndex) && zIndex > highestZIndex) {
                    highestZIndex = zIndex;
                }
            });

            // Defina o z-index da div atual como o maior z-index + 1
            DraggableDiv.css('z-index', highestZIndex + 1);
            ActualDiv.css('z-index', highestZIndex + 1);
        }
    });


}