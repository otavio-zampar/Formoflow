$(document).ready(function () {
    const data = [
        "bhaskara",
        "pitágoras",
        "área do círculo",
        "área do triângulo",
        "área do retângulo",
        "área do quadrado",
        "perímetro do círculo",
        "perímetro do triângulo",
        "perímetro do retângulo",
        "perímetro do quadrado",
        "teorema de Euler",
        "teorema de Fermat",
        "teorema de Pitágoras",
        "lei dos cossenos",
        "lei dos senos"
    ];
    

    $("#search-input").on("input", function () {
        const query = $(this).val().toLowerCase().trim();
        const resultsList = $("#results-list");
        
        resultsList.empty();

        if (query.length === 0) {
            $(".results-container").hide();
            return;
        }

        const filteredResults = data.filter(item => item.toLowerCase().includes(query));

        if (filteredResults.length > 0) {
            filteredResults.forEach(result => {
                const listItem = $("<li>").text(result);
                resultsList.append(listItem);
            });
            $(".results-container").show();
        } else {
            $(".results-container").hide();
        }
    });
});
