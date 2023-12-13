function openCalc() {
  if(openCal == 0){
    document.getElementById("myCalc").style.left = "0px";
    document.getElementById("btnMyCalc").style.left = "calc(40vw - 2.5rem)";
    document.getElementById("darker").style.backgroundColor = "#00000050";
    document.getElementById("darker").style.pointerEvents = "auto";
    document.getElementById("btnCalc").style.transform = "scaleX(1)";
    openCal = 1;
  }else{
    document.getElementById("myCalc").style.left = "-40vw";
    document.getElementById("btnMyCalc").style.left= "-3.5rem";
    document.getElementById("darker").style.backgroundColor = "#00000000";
    document.getElementById("darker").style.pointerEvents = "none";
    document.getElementById("btnCalc").style.transform = "scaleX(-1)";
    openCal = 0;
  }
}

function openDraw() {
  if(openDra == 0){
    document.getElementById("myDraw").style.left = "0px";
    document.getElementById("btnMyDraw").style.left = "calc(max(70%, 20rem) - 2.5rem)";
    document.getElementById("darker").style.backgroundColor = "#00000050";
    document.getElementById("darker").style.pointerEvents = "auto";
    document.getElementById("btnDraw").style.transform = "scaleX(1)";
    openDra = 1;
  }else{
    document.getElementById("myDraw").style.left = "min(-70%, -20rem)";
    document.getElementById("btnMyDraw").style.left= "-3.5rem";
    document.getElementById("darker").style.backgroundColor = "#00000000";
    document.getElementById("darker").style.pointerEvents = "none";
    document.getElementById("btnDraw").style.transform = "scaleX(-1)";
    openDra = 0;
  }
}
function openExtra(){
  if(openExt == 0){
    document.getElementById("myExtra").style.left = "calc(32vw - 24vw + 4vw)"; // left - width + that other tab
    document.getElementById("rotate").style.transform = "scaleX(-1)";
    openExt = 1;
  }else{
    document.getElementById("myExtra").style.left = "32vw";
    document.getElementById("rotate").style.transform = "scaleX(1)";
    openExt = 0;
  }
}