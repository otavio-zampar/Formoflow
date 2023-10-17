function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/([^\w]+|\s+)/g, "");
}

$(document).ready(function () {  

    $("#searchBar").on("input", function () {
        const query = $(this).val().toLowerCase().trim();
        const resultsList = $("#lista");
        
        resultsList.empty();

        if (query.length === 0) {
            $(".pesquisa").hide();
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
                setTimeout(() => {
                    const listItem = $("<li>").text(result.option);
                    listItem.addClass("resposta");
                    listItem.click(() => {
                        createDiv(result.option, result.form, result.qnt);
                    });
                    // listItem.on("click", alert());
                    resultsList.append(listItem);
                    // resultsList
                }, 1 * index); // Atraso de 100ms para cada item
            });
            $(".pesquisa").show();
        } else {
            $(".pesquisa").hide();
        }
    });

    $("#searchBar").focus(function () {
        if ($("#searchBar").val().toLowerCase().trim().length != 0) {
            $("#lista").css("outline", "#d1d1d1 solid 3px");
        }
    });

    $("#searchBar").blur(function () {
        if ($("#searchBar").val().toLowerCase().trim().length == 0) {
            $("#lista").css("outline", "#f0f0f0 solid 3px");
        }
        
    });
});