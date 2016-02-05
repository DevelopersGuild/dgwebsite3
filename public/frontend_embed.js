// Frontend test js example
// Suppose to be a calculator
var a = 1;

var b = 2;

var operand = "plus";

function runOp(x,y,operand){
  var result;
  if (operand == "plus"){
    result = a+b;
  }
  return result;
}

document.getElementById("calculator").innerHTML = runOp(a,b, operand);
