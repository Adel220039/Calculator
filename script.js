let calculation = document.querySelector('.formula');
let result = document.querySelector('.result');

let calcul ='';

function getNum(value){
    if(calcul === '' && value ==='.'){
        return;
    }
    if(calcul.at(-1) === '.' && value ==='.'){
        return;
    }
    addToCalculation(value)
}

function getOprator(value){
    const oprts =['%', '/', '*', '-', '+'];
    if (value === '(') {
        // Always allow '('
        addToCalculation(value);
        return;
    }
    if (value === ')') {
        // Only allow ')' if there is an unmatched '('
        const open = (calcul.match(/\(/g) || []).length;
        const close = (calcul.match(/\)/g) || []).length;
        if (open > close && calcul.length > 0 && calcul.at(-1) !== '(' && !oprts.includes(calcul.at(-1))) {
            addToCalculation(value);
        }
        return;
    }
    if(calcul ==='') return;
    if(oprts.some(opr => calcul.at(-1) === opr)){
        return;
    }
    if(result.textContent !== '' && result.textContent === 'Error'){
        calcul = result.textContent;
        result.textContent = '';
    }
    addToCalculation(value)
}



function addToCalculation(value) {
    calcul += value;
    let wait = calcul.replace(/\*/g, 'x');
    calculation.textContent = wait.replace(/\//g, '÷');
}

const history = JSON.parse(localStorage.getItem('history'))||[];

function clearAll() {
    history.unshift({calcul , result: result.textContent});
    saveHistory()
    calcul = '';
    calculation.textContent = '';
    result.textContent = '';
    displayHistory()
}

function deleteIt(){
    if(calcul.length>0){
        calcul = calcul.slice(0,-1)
        result.textContent = '';
        let wait = calcul.replace(/\*/g, 'x');
        calculation.textContent = wait.replace(/\//g, '÷');
    }
}

function getResult() {
    try{
        // Replace numbers followed by % with (number/100)
        let expression = calcul.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
        // Insert * between a number or closing parenthesis and an opening parenthesis
        expression = expression.replace(/(\d|\))\s*\(/g, '$1*(');
        // Insert * between a closing parenthesis and a number or opening parenthesis
        expression = expression.replace(/\)\s*(\d|\()/g, ')*$1');
        result.textContent = eval(expression);
    }catch(e){
        result.textContent = 'Error';
    }
}
;

function saveHistory() {
    localStorage.setItem('history', JSON.stringify(history))
}

document.querySelector('.historic-btn').addEventListener('click', () => {
    const historyList = document.querySelector('.historic');
    historyList.classList.toggle('historic-active');
});
function displayHistory(){
  document.querySelector('.list').innerHTML = history.map(item =>{return `<li>${item.calcul} = ${item.result}</li><button class="removeIt">Delete</button>`}).join(' ')
  document.querySelectorAll('.removeIt')
   .forEach((btn,index)=>{
    btn.addEventListener('click', ()=>{
        history.splice(index,1)
        saveHistory()
        displayHistory()
    })
 })
}
displayHistory()


