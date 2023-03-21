function openCalc() {
  if(openCal == 0){
    document.getElementById("myCalc").style.left = "0%";
    document.getElementById("btnMyCalc").style.left = "calc(40% - 2.5rem)";
    document.getElementById("darker").style.backgroundColor = "#00000050";
    document.getElementById("darker").style.pointerEvents = "auto";
    document.getElementById("btnCalc").style.transform = "rotate(0deg)";
    openCal = 1;
  }else{
    document.getElementById("myCalc").style.left = "-40%";
    document.getElementById("btnMyCalc").style.left= "-3.5rem";
    document.getElementById("darker").style.backgroundColor = "#00000000";
    document.getElementById("darker").style.pointerEvents = "none";
    document.getElementById("btnCalc").style.transform = "rotate(180deg)";
    openCal = 0;
  }
}

function openDraw() {
  if(openDra == 0){
    document.getElementById("myDraw").style.left = "0%";
    document.getElementById("btnMyDraw").style.left = "calc(70% - 2.5rem)";
    document.getElementById("darker").style.backgroundColor = "#00000050";
    document.getElementById("darker").style.pointerEvents = "auto";
    document.getElementById("btnDraw").style.transform = "rotate(0deg)";
    openDra = 1;
  }else{
    document.getElementById("myDraw").style.left = "-70%";
    document.getElementById("btnMyDraw").style.left= "-3.5rem";
    document.getElementById("darker").style.backgroundColor = "#00000000";
    document.getElementById("darker").style.pointerEvents = "none";
    document.getElementById("btnDraw").style.transform = "rotate(180deg)";
    openDra = 0;
  }
}
function openExtra(){
  if(openExt == 0){
    document.getElementById("myExtra").style.left = "45%";
    document.getElementById("rotate").style.transform = "rotate(180deg)";
    openExt = 1;
  }else{
    document.getElementById("myExtra").style.left = "95%";
    document.getElementById("rotate").style.transform = "rotate(0deg)";
    openExt = 0;
  }
}