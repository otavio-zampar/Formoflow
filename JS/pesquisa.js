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
                        if(result.type == "range" || result.form == "textarea"){
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
        if (!($("#lista, #searchBar, .resposta, #lupa, #lista").is(e.target))) {
            $("#lista").hide();
            $("#searchBar").css("border-radius", "1rem");
        }
        if (!($("#divOutraLista, .DivOutraListaBoogaloo, .outraLista, .outraListaIcon, .filler, .resposta2, .resposta3").is(e.target)) && abertoLista) {
            abreLista(abertoLista); 
            abertoLista = !abertoLista;
        }
    });

});

function criaListaCompleta(data){
    const dataAgrupado = data.reduce((grupos, data) => {
        const group = data.group;
        if (!grupos[group]) {
            grupos[group] = [];
        }
        grupos[group].push(data);
        return grupos;
    }, {});
    criaLiCompleto(dataAgrupado);
}

function criaLiCompleto(data){

    for (const [keys, value] of Object.entries(data)) {

        const tituloList = $("<p>").text(keys).addClass("resposta3 noCopy");
        $("#outraLista").append(tituloList);

        value.forEach((r)=>{
            const listItem = $("<li>").text(r.option);
            listItem.addClass("resposta2 noCopy");
            listItem.click(() => {
                if(r.type == "range" || r.form == "textarea"){
                    createEntradaDiv(r);
                }else{
                    createDiv(r);
                }
            });
            $("#outraLista").append(listItem);
        });
      }
}
