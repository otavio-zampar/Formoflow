function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/([^\w]+|\s+)/g, "");
}

function searchQuery(query, resultsList){
    resultsList.empty();

        if (query.length === 0) {
            $("#lista").hide();
            $("#searchBar").css("border-radius", "1rem");
            return;
        }

        const normalizedQuery = removeAccents(query.toLowerCase());
        const filteredResults = data.filter(item => {
          const normalizedOption = removeAccents(item.option.toLowerCase());
          return normalizedOption.includes(normalizedQuery);
        });
        const startsWithQuery = filteredResults.filter(item => item.option.toLowerCase().startsWith(query));
        const doesNotStartWithQuery = filteredResults.filter(item => !item.option.toLowerCase().startsWith(query));
        const prioritizedResults = startsWithQuery.concat(doesNotStartWithQuery);


        if (prioritizedResults.length > 0) {
            prioritizedResults.slice(0, 6).forEach((result, index) => {
                $("#searchBar").css("border-radius", "1rem 1rem 0rem 0rem");
                    const listItem = $("<li>").text(result.option);
                    listItem.addClass("resposta noCopy");
                    listItem.click(() => {
                        if(result.type == 'range' || result.form == 'textarea'){
                            createEntradaDiv(result);
                        }else{
                            createDiv(result);
                        }
                        $("#searchBar").val("");
                        $("#lista").hide();
                        $("#searchBar").css("border-radius", "1rem");
                    });
                    resultsList.append(listItem);
                });
            $("#lista").show();
            $("#lista").css("z-index", "9983");
        } else {
            $("#lista").hide();
        }
}

$(document).ready(function () {  

    $("#searchBar").on("input", function () {
        const query = $(this).val().toLowerCase().trim();
        const resultsList = $("#lista");
        
        searchQuery(query, resultsList);
    });

    $("#searchBar").focus(function () {
        if ($("#searchBar").val().toLowerCase().trim().length != 0) {
            $("#lista").show();
        }
        const query = $(this).val().toLowerCase().trim();
        const resultsList = $("#lista");
        searchQuery(query, resultsList);
    });

    $(document).mousedown(function(e){
        if (!($('#lista, #searchBar, .resposta, #lupa, #lista').is(e.target))) {
            $('#lista').hide();
            $("#searchBar").css("border-radius", "1rem");
        }
    });

});

function criaListaCompleta(data){

    // data.forEach(result =>{
    //     console.log(result.option);
    // });

    criaLiCompleto(data);
}


function criaLiCompleto(data){
    data.forEach(result => {
        console.log(result.option);
        const listItem = $("<li>").text(result.option).css({
            // "right": "0px",
            // "position": "absolute",
        });
        listItem.addClass("resposta2 noCopy");
        listItem.click(() => {
            if(result.type == 'range' || result.form == 'textarea'){
                createEntradaDiv(result);
            }else{
                createDiv(result);
            }
        });
        $("#outraLista").append(listItem);
    });
}
