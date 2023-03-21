var arrCanvas = []; //empty var
var img = new Image;
var dec = inc = 0;

window.onload = function(){
    // alert();
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

        //     ctx.moveTo(0, 0);
        //     ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
        //     ctx.stroke();

        //     ctx.globalCompositeOperation = "destination-out";
        //     ctx.moveTo(100, 100);
        //     ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
        //     ctx.stroke();


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
    for(let i = arrCanvas.length + 1; i > 0; i++){
            arrCanvas[i].pop();
    }
    arrCanvas.push(myCanvas.toDataURL());
    console.log(arrCanvas.length);
}

function changeSize(value){
        //nao consegui fazer sem o 'for' por motivos que me falham a compreensao
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
}
function download_img(yrn){
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
function historySave(){
        arrCanvas.push(myCanvas.toDataURL());
        // for(let i = 0; i < arrCanvas.length; i++)
        //         console.log(arrCanvas[i]);
        dec = arrCanvas.length;
        // console.log(dec);
}
function und(){
        
        img.src = arrCanvas[dec];
        myCanvas.getContext("2d").clearRect(0, 0, myCanvas.width, myCanvas.height);
        myCanvas.getContext("2d").drawImage(img, 0, 0);
        if(dec > 0){
                dec--;
        }
        console.log(dec);
        inc = dec;
}

function red(){

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