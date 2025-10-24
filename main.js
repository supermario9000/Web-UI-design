const speacialNumber = 7355608;
let displayvalue = "";
let result = 0;

function getDisplayEl() {
  return document.getElementById('display');
}

function display(val) {
  const el = getDisplayEl();
  if (!el) return;
  // Insert visual line breaks for very long uninterrupted sequences
  function wrapLongSequences(s, maxChars = 17) {
    return String(s).replace(new RegExp("(\\\S{" + (maxChars) + ",})", 'g'), (m) => {
      const parts = [];
      for (let i = 0; i < m.length; i += maxChars) parts.push(m.slice(i, i + maxChars));
      return parts.join('\n');
    });
  }

  const raw = (val === '' ? '0' : String(val));
  const formatted = wrapLongSequences(raw, 17);
  el.textContent = formatted;
}

// Special-number animation control
function startSpecialAnimation() {
  const bomb = document.querySelector('.bomb_light');
  if (!bomb) return;
  bomb.classList.add('active');
}

function stopSpecialAnimation() {
  const bomb = document.querySelector('.bomb_light');
  if (!bomb) return;
  bomb.classList.remove('active');
}

function checkSpecialTrigger() {
  try {
    const needle = String(speacialNumber);
    if (!needle) return;
    if (displayvalue && displayvalue.includes(needle)) {
      startSpecialAnimation();
    } else {
      stopSpecialAnimation();
    }
  } catch (e) { /* ignore */ }
}

window.appendNumber = function(value) {
  // Append characters to the expression string used for display.
  if (value == null) return;
  const valStr = String(value);

  const operators = ['+', '−', '×', '÷', '*', '/'];
  const prevChar = displayvalue.slice(-1);
  const newFirstChar = valStr[0];
  const prevIsOp = operators.includes(prevChar);
  const newIsOp = operators.includes(newFirstChar) || valStr.startsWith('**');
  if (prevIsOp && newIsOp) {
    twoOperationError();
    return;
  }

  // Prevent leading zeros like '0...' unless user explicitly types '0'
  if (displayvalue === '0' && !newIsOp) displayvalue = '';

  displayvalue += valStr;
  display(displayvalue);
  checkSpecialTrigger();
};

window.clearDisplay = function() {
  displayvalue = '';
  display(displayvalue);
  checkSpecialTrigger();
};

window.deleteLast = function() {
  displayvalue = displayvalue.slice(0, -1);
  display(displayvalue);
  checkSpecialTrigger();
};

/* Arithmetic and special operations */
window.sineOperation = function() { appendNumber('sin('); };
window.cosineOperation = function() { appendNumber('cos('); };
window.customPowerOperation = function() { appendNumber('**'); };
window.squareRootOperation = function() { appendNumber('√('); };
window.powerOperation = function() { appendNumber('**2'); };
window.multiplicationOperation = function() { appendNumber('×'); };
window.divisionOperation = function() { appendNumber('÷'); };
window.subtractionOperation = function() { appendNumber('−'); };
window.sumOperation = function() { appendNumber('+'); };

window.calculateResult = function() {
  if (!displayvalue) return;
  try {
    // Map printable/display tokens to JS-evaluable expression
    let expr = String(displayvalue);

    expr = expr.replace(/,/g, '.');
    expr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    
    expr = expr.replace(/√\(/g, 'Math.sqrt(');
    expr = expr.replace(/sin\(/g, 'Math.sin(').replace(/cos\(/g, 'Math.cos(');
    // Evaluate (note: Function is used only for this demo)
    const res = Function('return (' + expr + ')')();
    if (res === Infinity) {
      infinityError();
      return;
    }
    if (res === -Infinity) {
      divZeroError();
      return;
    }
    result = res;
    displayvalue = String(res);
    display(displayvalue);
  checkSpecialTrigger();
  } catch (e) {
    console.error('Evaluation error:', e);
    display('Error');
    displayvalue = '';
  }
};

function divZeroError(){
    display('Error: Division by zero');
}

function infinityError(){
    display('Error: Result is Infinity');
}

function twoOperationError(){
    display('Error: Two operations in a row');
}

// Initialize display on load
document.addEventListener('DOMContentLoaded', () => display(displayvalue));