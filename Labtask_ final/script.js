console.log("connected");

    const display = document.getElementById('display');
    const numberBtns = document.querySelectorAll('.number');
    const operatorBtns = document.querySelectorAll('.operator');
    const equalsBtn = document.getElementById('equalsBtn');
    const clearBtn = document.getElementById('clearBtn');

    let lastWasEqual = false;

    function isOperator(char) {
      return char === '+' || char === '-' || char === '*' || char === '/';
    }

    function trimTrailingOperator(expr) {
      while (expr.length > 0 && isOperator(expr[expr.length - 1])) {
        expr = expr.slice(0, -1);
      }
      return expr;
    }

    function setDisplayValue(val) {
      display.value = val;
    }

    function resetCalculator() {
      setDisplayValue('0');
      lastWasEqual = false;
    }

    function handleNumber(digit) {
      let current = display.value;
      if (current === 'Error') {
        setDisplayValue(digit);
        lastWasEqual = false;
        return;
      }
      if (lastWasEqual) {
        setDisplayValue(digit);
        lastWasEqual = false;
        return;
      }
      if (current === '0') {
        setDisplayValue(digit);
      } else {
        setDisplayValue(current + digit);
      }
    }

    function handleOperator(op) {
      let current = display.value;
      if (current === 'Error') return;

      if (lastWasEqual) {
        setDisplayValue(current + op);
        lastWasEqual = false;
        return;
      }

      if (current === '0') {
        if (op === '-') setDisplayValue('-');
        return;
      }

      let lastChar = current[current.length - 1];
      if (isOperator(lastChar)) {
        setDisplayValue(current.slice(0, -1) + op);
      } else {
        setDisplayValue(current + op);
      }
    }

    function calculate() {
      let expr = display.value;
      if (expr === 'Error') return;

      expr = trimTrailingOperator(expr);
      if (expr === '') {
        setDisplayValue('0');
        lastWasEqual = true;
        return;
      }

      try {
        let result = eval(expr);
        if (!Number.isFinite(result) || isNaN(result)) {
          setDisplayValue('Error');
          lastWasEqual = false;
        } else {
          setDisplayValue(String(result));
          lastWasEqual = true;
        }
      } catch {
        setDisplayValue('Error');
        lastWasEqual = false;
      }
    }

   
    numberBtns.forEach(btn => {
      btn.addEventListener('click', () => handleNumber(btn.getAttribute('data-value')));
    });

    operatorBtns.forEach(btn => {
      btn.addEventListener('click', () => handleOperator(btn.getAttribute('data-value')));
    });

    equalsBtn.addEventListener('click', calculate);
    clearBtn.addEventListener('click', resetCalculator);

    
    document.addEventListener('keydown', (e) => {
      const key = e.key;
      if (['0','1','2','3','4','5','6','7','8','9','+','-','*','/','Enter','Escape','='].includes(key)) {
        e.preventDefault();
      }
      if (key >= '0' && key <= '9') handleNumber(key);
      else if (key === '+' || key === '-' || key === '*' || key === '/') handleOperator(key);
      else if (key === 'Enter' || key === '=') calculate();
      else if (key === 'Escape' || key.toLowerCase() === 'c') resetCalculator();
    });
  