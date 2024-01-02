function mudaTema(dark) {
    if(dark){
        document.documentElement.style.setProperty("--Black", "#FFFFFF");
        document.documentElement.style.setProperty("--BlackFocus", "#797979");
        document.documentElement.style.setProperty("--RealDarkBlue", "#696969");
        document.documentElement.style.setProperty("--RealDarkBlueCalc", "#0f0f0f");
        document.documentElement.style.setProperty("--RealDarkBlueBTN", "#f0f0f0");
        document.documentElement.style.setProperty("--AlmostTransparent", "#0000001f");
        document.documentElement.style.setProperty("--BaseColor", "#000000");
        document.documentElement.style.setProperty("--BaseColorBTN", "#121212");
        document.documentElement.style.setProperty("--AzulClaroBkg", "#FFFFFF33");
        document.documentElement.style.setProperty("--Red", "#FFFFFF");
        document.documentElement.style.setProperty("--SecondAccentColor", "#464646");
        document.documentElement.style.setProperty("--SecondAccentColorCalc", "#232323");
        document.documentElement.style.setProperty("--SecondAccentColorFlags", "#212121");
        document.documentElement.style.setProperty("--AccentColor", "#121212");
        document.documentElement.style.setProperty("--AccentColorExtra", "#1f1f1f");
        document.documentElement.style.setProperty("--AccentColorPick", "#212121");
        document.documentElement.style.setProperty("--AccentColorBTN", "#f0f0f0");
        document.documentElement.style.setProperty("--LightGray", "#232323");
        document.documentElement.style.setProperty("--LightGrayBTN", "#f0f0f0");
        document.documentElement.style.setProperty("--AlmostWhite", "#111111");
        document.documentElement.style.setProperty("--WhiteFocus", "#282828");
        document.documentElement.style.setProperty("--White", "#232323");
        document.documentElement.style.setProperty("--White2", "#212121");
        document.documentElement.style.setProperty("--WhiteBTN", "#f0f0f0");
        
        var github = document.getElementById("github");
        github.firstElementChild.style.display = "none";
        github.lastElementChild.style.display = "initial";

        document.getElementById("moon").style.display = "initial";
        document.getElementById("sun").style.display = "none";
        document.getElementById("pTema").innerHTML = "DARK";

        document.getElementById("ColPck").value = "#FFFFFF";
        $("#ColPck").trigger("change");

        $(".tstDiv").each(function () {
            this.style.backgroundColor = $(this).attr("graycolor");
        });

        $(".tstDiv :input").each(function () {
            if ($(this).attr("inputpai")) {
                var inputPai = "#" + $(this).attr("inputpai");
                if ($(this).attr("inputpai").slice(0, 4) == "icon") {
                    $(this).css("outline-color", $(inputPai).parent().css("background-color"));
                }else{
                    $(this).css("outline-color", $(inputPai).parent().parent().css("background-color"));
                }
            }
        });

    }else{
        document.documentElement.style.setProperty("--Black", "#000000");
        document.documentElement.style.setProperty("--BlackFocus", "#020202");
        document.documentElement.style.setProperty("--RealDarkBlue", "#1f1926");
        document.documentElement.style.setProperty("--RealDarkBlueCalc", "#1f1926");
        document.documentElement.style.setProperty("--RealDarkBlueBTN", "#1f1926");
        document.documentElement.style.setProperty("--AlmostTransparent", "#0000001f");
        document.documentElement.style.setProperty("--BaseColor", "#322c40");
        document.documentElement.style.setProperty("--BaseColorBTN", "#322c40");
        document.documentElement.style.setProperty("--AzulClaroBkg", "#80b9e0");
        document.documentElement.style.setProperty("--Red", "#cf0000");
        document.documentElement.style.setProperty("--SecondAccentColor", "#605869");
        document.documentElement.style.setProperty("--SecondAccentColorCalc", "#605869");
        document.documentElement.style.setProperty("--SecondAccentColorFlags", "#605869");
        document.documentElement.style.setProperty("--AccentColor", "#B6B7CF");
        document.documentElement.style.setProperty("--AccentColorExtra", "#B6B7CF");
        document.documentElement.style.setProperty("--AccentColorPick", "#B6B7CF");
        document.documentElement.style.setProperty("--AccentColorBTN", "#B6B7CF");
        document.documentElement.style.setProperty("--LightGray", "#dddddd");
        document.documentElement.style.setProperty("--LightGrayBTN", "#dddddd");
        document.documentElement.style.setProperty("--AlmostWhite", "#AAAAAA");
        document.documentElement.style.setProperty("--WhiteFocus", "#fdfdfd");
        document.documentElement.style.setProperty("--White", "#ffffff");     
        document.documentElement.style.setProperty("--White2", "#ffffff");
        document.documentElement.style.setProperty("--WhiteBTN", "#ffffff");

        var github = document.getElementById("github");
        github.firstElementChild.style.display = "initial";
        github.lastElementChild.style.display = "none";

        document.getElementById("moon").style.display = "none";
        document.getElementById("sun").style.display = "initial";
        document.getElementById("pTema").innerHTML = "LIGHT";
        
        document.getElementById("ColPck").value = "#000000";
        $("#ColPck").trigger("change");

        $(".tstDiv").each(function () {
            this.style.backgroundColor = $(this).attr("actualcolor");
        });

        $(".tstDiv :input").each(function () {
            if ($(this).attr("inputpai")) {
                var inputPai = "#" + $(this).attr("inputpai");
                if ($(this).attr("inputpai").slice(0, 4) == "icon") {
                    $(this).css("outline-color", $(inputPai).parent().css("background-color"));
                }else{
                    $(this).css("outline-color", $(inputPai).parent().parent().css("background-color"));
                }
            }
        });
    }
}

function abreLista(abertoLista){

    abertoLista = !abertoLista;
    if (abertoLista) {
        document.getElementById("BTNoutraLista").style.top = "2rem";
        document.getElementById("BTNoutraLista").style.zIndex = "9999";

        setTimeout(()=> {
            document.getElementById("BTNoutraLista").style.borderBottomRightRadius = "0px";
            document.getElementById("BTNoutraLista").style.borderBottomLeftRadius = "0px";

            document.getElementById("divOutraLista").style.borderTopRightRadius = "0px";
            document.getElementById("divOutraLista").style.display = "";
        }, 150);
    } else {
        document.getElementById("BTNoutraLista").style.top = "";
        document.getElementById("BTNoutraLista").style.borderBottomLeftRadius = "";
        document.getElementById("BTNoutraLista").style.borderBottomRightRadius = "";
        // não precisa de timeout pq a divOutraLista desaparece em 0s

        document.getElementById("divOutraLista").style.borderTopRightRadius = "";
        document.getElementById("divOutraLista").style.display = "none"; // initial estava dando problema
    }


}