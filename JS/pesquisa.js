$(document).ready(function () {

    $("#searchBar").focus(function () {
        $("#lista").css("outline", "#2d2d2d solid 3px");
    });

    $("#searchBar").blur(function () {
        $("#lista").css("outline", "#f0f0f0 solid 3px");
    });

    const data = [
        { option: "bhaskara", message: "Bom dia" },
        { option: "pitágoras", message: "Boa noite" },
        { option: "área do círculo", message: "Olá, como vai?" },
        // Adicione outras opções com mensagens personalizadas aqui
    ];
    

    $("#searchBar").on("input", function () {
        const query = $(this).val().toLowerCase().trim();
        const resultsList = $("#lista");
        
        resultsList.empty();

        if (query.length === 0) {
            $(".pesquisa").hide();
            $("#searchBar").css("border-radius", "1rem");
            return;
        }

        const filteredResults = data.filter(item => item.option.toLowerCase().includes(query));

        if (filteredResults.length > 0) {
            filteredResults.forEach((result, index) => {
                $("#searchBar").css("border-radius", "1rem 1rem 0rem 0rem");
                setTimeout(() => {
                    const listItem = $("<li>").text(result.option);
                    listItem.addClass("resposta");
                    listItem.click(() => {
                        alert(result.message);
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
});
