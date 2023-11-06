function sepPare(input){
  let openParenCount = 0;
  let myOpenParenIndex = 0;
  let myEndParenIndex = 0;
  const result = [];

  for(let i = 0; i < input.length; i++){
    
    if(input[i] === '('){
      if(openParenCount === 0){
        myOpenParenIndex=i;

        // checking if anything exists before this set of parentheses
        if(i !== myEndParenIndex){
          result.push(input.substring(myEndParenIndex, i));
        }
      }
      openParenCount++;
    }

    if(input[i] === ')'){
      openParenCount--;
      if(openParenCount === 0){
        myEndParenIndex=i+1;

        // recurse the contents of the parentheses to search for nested ones
        result.push(sepPare(input.substring(myOpenParenIndex+1, i)));
      }
    }
  }

  // capture anything after the last parentheses
  if(input.length > myEndParenIndex){
    result.push(input.substring(myEndParenIndex, input.length));
  }

  return result;
}

// (3+3!)*3 = 27, ok
// (3+3)! = 720, not ok
function doFat(expression) {
    // Regular expression pattern to match numbers followed by an exclamation mark
    const pattern = /(\d+!)/g;
  
    // Replace the matched pattern with "fatoracao" followed by the number
    return expression.replace(pattern, (match) => {
      return "fatoracao(" + match.slice(0, -1) + ")";
    });
  }
  
  


// (3+5)^2 gives 28 (3 + 5^2), not 64
function doExpo(result){
    var entireString = "";
    for(x in result){
        entireString += result[x];
    }
    return entireString;
}

function doSqrt(result){
    var entireString = "";
    for(x in result){
        // √2+3 funciona, 3+√2 funciona, 3+√2+3 funciona
        if(result[x].indexOf("√") != -1){
            result[x] = result[x].substring(0, result[x].indexOf("√")+1) + "(" + result[x].substring(result[x].indexOf("√")+1);
            for(i in result[x]){
                if(result[x][i]==='+'||result[x][i]==='-'||result[x][i]==='÷'||result[x][i]==='×'||result[x][i]==='/'||result[x][i]==='*'){
                    if(i > result[x].indexOf("√")){
                        result[x] = result[x].substring(0, i) + ")" + result[x].substring(i);
                        break;
                    }
                }
            }
        }
        entireString += result[x];
    }
    return entireString;
}

function multiply(CharAnsDoc){
    if((CharAnsDoc >= '0' && CharAnsDoc <= '9') || CharAnsDoc == ')'){
        return true;
    }else{
        return false;
    }
}

	//add um verificador antes de fazer o doEval(), pra garantir que por exemplo 'Sin(' nao vai virar 'Math.sin(' caso de algum erro
function doEval(ansDoc){
    if(ansDoc.includes('π')){
        if(multiply(ansDoc[parseFloat(ansDoc.indexOf('π')-1)])){
            ansDoc = ansDoc.substring(0, ansDoc.indexOf('π')) + "*" + ansDoc.substring(ansDoc.indexOf('π'));
        }
        if(multiply(ansDoc[parseFloat(ansDoc.indexOf('π')+1)])){
            ansDoc = ansDoc.substring(0, ansDoc.indexOf('π')+1) + "*" + ansDoc.substring(ansDoc.indexOf('π')+1);
        }
        ansDoc = ansDoc.replaceAll('π', Math.PI);
    }
    if(ansDoc.includes('E')){
        if(multiply(ansDoc[parseFloat(ansDoc.indexOf('E')-1)])){
            ansDoc = ansDoc.substring(0, ansDoc.indexOf('E')) + "*" + ansDoc.substring(ansDoc.indexOf('E'));
        }
        if(multiply(ansDoc[parseFloat(ansDoc.indexOf('E')+1)])){
            ansDoc = ansDoc.substring(0, ansDoc.indexOf('E')+1) + "*" + ansDoc.substring(ansDoc.indexOf('E')+1);
        }
        ansDoc = ansDoc.replaceAll('E', Math.E);
    }
    if(ansDoc.includes('%')){
        if(multiply(ansDoc[parseFloat(ansDoc.indexOf('%')+1)])){
            ansDoc = ansDoc.substring(0, ansDoc.indexOf('%')+1) + "*" + ansDoc.substring(ansDoc.indexOf('%')+1);
        }
        ansDoc = ansDoc.replaceAll('%', '/100');
    }
    if(ansDoc.includes('(')){
        if(multiply(ansDoc[parseFloat(ansDoc.indexOf('(')-1)])){
            ansDoc = ansDoc.substring(0, ansDoc.indexOf('(')) + "*" + ansDoc.substring(ansDoc.indexOf('('));
        }
    }
    if(ansDoc.includes(')')){
        if(multiply(ansDoc[parseFloat(ansDoc.indexOf(')')+1)])){
            ansDoc = ansDoc.substring(0, ansDoc.indexOf(')')+1) + "*" + ansDoc.substring(ansDoc.indexOf(')')+1);
        }
    }
    if(ansDoc.includes('÷')){
        ansDoc = ansDoc.replaceAll('÷', '/');
    }
    if(ansDoc.includes('×')){
        ansDoc = ansDoc.replaceAll('×', '*');
    }
    if(ansDoc.includes('^')){
        ansDoc = doExpo(sepPare(ansDoc));
        ansDoc = ansDoc.replaceAll('^', "**");
    }
    if(ansDoc.includes('√')){
        if(multiply(ansDoc[parseFloat(ansDoc.indexOf('√')-1)])){
            ansDoc = ansDoc.substring(0, ansDoc.indexOf('√')) + "*" + ansDoc.substring(ansDoc.indexOf('√'));
        }
        // catch -
        // addi at the end
        ansDoc = doSqrt(sepPare(ansDoc));
        ansDoc = ansDoc.replaceAll('√', 'Math.sqrt');
    }
    if(ansDoc.includes(log)){
        if(multiply(ansDoc[parseFloat(ansDoc.indexOf(log))-1])){
            ansDoc = ansDoc.substring(0, ansDoc.indexOf(log)) + "*" + ansDoc.substring(ansDoc.indexOf(log));
        }
        ansDoc = ansDoc.replaceAll(log, 'Math.log10(');
    }
    if(ansDoc.includes(sin)){
        if(multiply(ansDoc[parseFloat(ansDoc.indexOf(sin))-1])){
            ansDoc = ansDoc.substring(0, ansDoc.indexOf(sin)) + "*" + ansDoc.substring(ansDoc.indexOf(sin));
        }
        if(document.getElementById('switch2').innerHTML == "DEG"){
            ansDoc = ansDoc.replaceAll(sin, 'Math.sin('+MathDeg); //Sin(30) in degree
        }else{
            ansDoc = ansDoc.replaceAll(sin, 'Math.sin(');
        }
        
    }
    if(ansDoc.includes(cos)){
        if(multiply(ansDoc[parseFloat(ansDoc.indexOf(cos))-1])){
            ansDoc = ansDoc.substring(0, ansDoc.indexOf(cos)) + "*" + ansDoc.substring(ansDoc.indexOf(cos));
        }
        ansDoc = ansDoc.replaceAll(cos, 'Math.cos('+MathDeg);
    }
    if(ansDoc.includes(tan)){
        if(multiply(ansDoc[parseFloat(ansDoc.indexOf(tan))-1])){
            ansDoc = ansDoc.substring(0, ansDoc.indexOf(tan)) + "*" + ansDoc.substring(ansDoc.indexOf(tan));
        }
        ansDoc = ansDoc.replaceAll(tan, 'Math.tan('+MathDeg);
    }
    if(ansDoc.includes('!')){
        ansDoc = doFat(ansDoc);
    }
    if(ansDoc.includes("undefined")){
        ansDoc = ansDoc.replaceAll('undefined', '');
    }
    if(ansDoc.includes(",")){
        ansDoc = ansDoc.replaceAll(',', '');
    }

    var parenCntr = 0;
    for(x in ansDoc){
        if(ansDoc[x] == "("){
            parenCntr++;
        }
        if(ansDoc[x] == ")"){
            parenCntr--;
        }
    }
    if(parenCntr > 0){
        for (parenCntr; parenCntr > 0; parenCntr--) {
            ansDoc += ")";
        }
    }

    //aproximaçao pq Math.sin n faz isso
    var hasSin = 0;
    if(ansDoc.includes("Math.sin(") || ansDoc.includes("Math.cos(") || ansDoc.includes("Math.tan(")){
       hasSin++; 
    }

    // alert(ansDoc); // pra testar coisas antes de resolver

    //da parse na string
    if(ansDoc != ""){
        ansDoc = Function('"use strict"; return '+ ansDoc)(); 
    }
    //casos especiais
    if(hasSin > 0){
        if(ansDoc <= 0.000000000000001 && ansDoc >= -0.000000000000001){
            ansDoc = 0;
        }
        if(ansDoc >= 0.4999999999999999 && ansDoc <= 0.5000000000000001){
            ansDoc = 0.5;
        }
        if(ansDoc >= 0.9999999999999999 && ansDoc <= 1.0000000000000001){
            ansDoc = 1;
        }
    }
    if(ansDoc == "Infinity"){
        ansDoc = '∞';
    }
    /* if(ansDoc.includes("undefined")){
        ansDoc = ansDoc.replaceAll('undefined', '');
    } */

    //imprime na tela
    return ansDoc;
    // alert(document.calculator.ans.value); /para testar depois de resolver
}