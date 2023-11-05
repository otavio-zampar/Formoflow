var arrCanvas = []; //empty var
var img = new Image;
var dec = inc = 0;

window.onload = function(){
        
    document.getElementById("sizeText").value = 5;
    document.getElementById("sizeRange").value = 5;
    document.getElementById("ColPck").value = '#000000';
    

    const vw = document.documentElement.clientWidth / 100;
    const vh = document.documentElement.clientHeight / 100;
    var myCanvas = document.getElementById("myCanvas");
    var curColor = document.getElementById("ColPck").value;
    if(myCanvas){
            var isDown  = false;
            var ctx = myCanvas.getContext("2d");
            ctx.canvas.width = 50 * vw;
            ctx.canvas.height = 90 * vh;
            var canvasX = 0, canvasY = 0;
            ctx.lineWidth = 5;
            arrCanvas.push(myCanvas.toDataURL());

            $(myCanvas)
            .mousedown(function(event){
                    if(document.getElementById("penFull").style.opacity == 1 || document.getElementById("eraserFull").style.opacity == 1){
                        if(document.getElementById("eraserFull").style.opacity == 1){
                                ctx.globalCompositeOperation = "destination-out";
                        }
                        isDown = true;
                        ctx.beginPath();
                        canvasX = event.offsetX;
                        canvasY = event.offsetY;
                        ctx.moveTo(canvasX, canvasY);
                    }
            })
            .mousemove(function(event){
                    if(isDown != false) {
                        canvasX = event.offsetX;
                        canvasY = event.offsetY;

                        ctx.lineTo(canvasX, canvasY);
                        ctx.lineCap = "round";
                        ctx.lineJoin = "round"; 
                        ctx.strokeStyle = curColor;
                        ctx.stroke();
                    }
            })
            .mouseup(function(event){
                    var newX = event.pageX;
                    var newY = event.pageY;

                    if(newX == canvasX && newY == canvasY){
                        ctx.lineTo(canvasX, canvasY);
                        ctx.lineCap = "round";
                        ctx.lineJoin = "round"; 
                        ctx.strokeStyle = curColor;
                        ctx.stroke();
                    }
                    isDown = false;
                    ctx.closePath();
                    if(document.getElementById("penFull").style.opacity == 1){
                        historySave();
                    }
                    
                    if(document.getElementById("eraserFull").style.opacity == 1){
                        ctx.globalCompositeOperation = "source-over";
                    }

            });

            // Função para atualizar a posição do círculo de acordo com a posição do mouse
            function seguirMouse(event) {
                var ctx = myCanvas.getContext("2d");
                var mouseX = event.offsetX;
                var mouseY = event.offsetY;

                // Atualize a posição do círculo
                mouseFollower.style.opacity = 1;
                mouseFollower.style.left = mouseX - ctx.lineWidth/2 + "px"; // 10 é metade do tamanho do círculo
                mouseFollower.style.top = mouseY - ctx.lineWidth/2 + "px";
            }

            // Adicione um ouvinte de evento para capturar o movimento do mouse
            myCanvas.addEventListener("mousemove", seguirMouse);
            myCanvas.addEventListener("mouseleave", function () {
                mouseFollower.style.display = "none";
                isDown = false;
                ctx.closePath();
            });
    
            // Adiciona um ouvinte de evento para mostrar o círculo quando o mouse entra no div
            myCanvas.addEventListener("mouseenter", function () {
                mouseFollower.style.display = "block";
            });

    }

    $('#ColPck').change(function () {
            curColor = document.getElementById("ColPck").value;
    });
    
};

window.onresize = function(){
    vw = document.documentElement.clientWidth / 100;
    vh = document.documentElement.clientHeight / 100;
    var ctx = myCanvas.getContext("2d");

    ctx.canvas.width = 50 * vw;
    ctx.canvas.height = 90 * vh;
    ctx.lineWidth = 5;
};

function clearCanvas(){
    var ctx = myCanvas.getContext("2d");
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    arrCanvas = [];
    arrCanvas.push(myCanvas.toDataURL());
}

function changeSize(value){
        //ie value = Math.round(0.02 * (i + 20) * ....
        var arr = [];
        for (let i = 0; i < value; i++) {
                arr[i] = Math.round(0.02 * (i + 20) * (i + 20) - 8);        
        }
        // alert(arr + "\n" +arr.length);
        var ctx = myCanvas.getContext("2d");
        if(value <= 1){
                ctx.lineWidth = 1;
        }else if(arr[arr.length-1] == 498){
                ctx.lineWidth = 500;
        }else{
                ctx.lineWidth = arr[arr.length-1];
        }
        var mouseFollower = document.getElementById("mouseFollower");
        mouseFollower.style.height = ctx.lineWidth + "px";
        mouseFollower.style.width = ctx.lineWidth + "px";
}
function download_img(yrn){ // yrn = fundo transparente ou n
        // ainda esta baixando com nomes estranhos, seria bom mudar
        var image = myCanvas.toDataURL("image/png");
        var link = document.createElement('a');
        link.href = image;
        var nome = window.prompt("Digite um nome para o arquivo: ", 'Download');
        if(!(nome == null)){
                link.download = nome;
                link.click();
        }
}

function send_img(yrn){ // yrn = fundo transparente ou n
        // ainda esta baixando com nomes estranhos, seria bom mudar
        // Criar um Blob a partir de uma string
        var byteCharacters = atob(myCanvas.toDataURL("image/png").split(',')[1]);
        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        var blob = new Blob([byteArray], { type: 'image/png' });

        // Atualize o atributo 'src' do elemento <img> com a imagem do Blob
        uploadImg(URL.createObjectURL(blob));

}

function historySave(){
        arrCanvas.push(myCanvas.toDataURL());
        // for(let i = 0; i < arrCanvas.length; i++)
        //         console.log(arrCanvas[i]);
        dec = arrCanvas.length;
        // console.log(dec);
}
function und(){ //undo
        
        img.src = arrCanvas[dec];
        myCanvas.getContext("2d").clearRect(0, 0, myCanvas.width, myCanvas.height);
        myCanvas.getContext("2d").drawImage(img, 0, 0);
        if(dec > 0){
                dec--;
        }
        console.log(dec);
        inc = dec;
}

function red(){ //redo

        img.src = arrCanvas[inc];
        myCanvas.getContext("2d").clearRect(0, 0, myCanvas.width, myCanvas.height);
        myCanvas.getContext("2d").drawImage(img, 0, 0);
        if(inc < arrCanvas.length-1){
                inc++;
        }
        dec = inc;

}
// "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAvoAAADrCAYAAAAYCjLCAAACzUlEQVR4nO3BMQEAAADCoPVPbQZ/oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4De95AAGZ4T0sAAAAAElFTkSuQmCC"

function increaseSize(dif){
        var ctx = myCanvas.getContext("2d");
        if(dif == true){
                ctx.lineWidth++;
        }else{
                ctx.lineWidth--;
        }
        document.getElementById('sizeText').value = ctx.lineWidth;
        var mouseFollower = document.getElementById("mouseFollower");
        mouseFollower.style.height = ctx.lineWidth + "px";
        mouseFollower.style.width = ctx.lineWidth + "px";
}

function getOposite(y){
        // y = 0.02 * (x - 20)² - 8
        // y - 8 = 0.02 * (x - 20)²
        // (y - 8) / 0.02 = (x - 20)²
        // 
        // (x - 20) = t
        // 
        // (y - 8) / 0.02 = t²
        // t = sqrt((y - 8) / 0.02)
        //
        // x = sqrt((y - 8) / 0.02) + 20
        //
        var x = Math.sqrt(Math.abs(y-8)/0.02)+20;
        return x;
}