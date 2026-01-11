class Calculator {
    constructor() {
        this.prevValue = '';
        this.currentValue = '0';
        this.operator = null;
        this.waitingForSecondOperand = false;
        
        this.displayElement = document.getElementById('display');
        this.historyElement = document.getElementById('history');
        this.init();
    }

    init() {
        // Event Listeners for Buttons
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', () => {
                const { value, action } = button.dataset;
                if (action === 'operator') this.handleOperator(value);
                else if (action === 'calculate') this.calculate();
                else if (action === 'clear') this.clear();
                else if (action === 'backspace') this.backspace();
                else this.appendNumber(value);
                this.updateUI();
            });
        });

        // Keyboard Support
        document.addEventListener('keydown', (e) => {
            if (e.key >= 0 && e.key <= 9) this.appendNumber(e.key);
            if (e.key === '.') this.appendNumber('.');
            if (['+', '-', '*', '/'].includes(e.key)) this.handleOperator(e.key);
            if (e.key === 'Enter' || e.key === '=') this.calculate();
            if (e.key === 'Backspace') this.backspace();
            if (e.key === 'Escape') this.clear();
            this.updateUI();
        });

        // Theme Toggle
        document.getElementById('theme-btn').addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
        });
    }

    appendNumber(number) {
        if (this.waitingForSecondOperand) {
            this.currentValue = number;
            this.waitingForSecondOperand = false;
        } else {
            if (this.currentValue === '0' && number !== '.') {
                this.currentValue = number;
            } else {
                if (number === '.' && this.currentValue.includes('.')) return;
                this.currentValue += number;
            }
        }
    }

    handleOperator(nextOperator) {
        const inputValue = parseFloat(this.currentValue);

        if (this.operator && this.waitingForSecondOperand) {
            this.operator = nextOperator;
            return;
        }

        if (this.prevValue === '') {
            this.prevValue = inputValue;
        } else if (this.operator) {
            const result = this.performCalculation(this.prevValue, inputValue, this.operator);
            this.currentValue = `${parseFloat(result.toFixed(7))}`;
            this.prevValue = result;
        }

        this.waitingForSecondOperand = true;
        this.operator = nextOperator;
    }

    performCalculation(v1, v2, op) {
        switch (op) {
            case '+': return v1 + v2;
            case '-': return v1 - v2;
            case '*': return v1 * v2;
            case '/': return v2 === 0 ? 'Error' : v1 / v2;
            default: return v2;
        }
    }

    calculate() {
        if (this.operator === null || this.waitingForSecondOperand) return;
        
        const result = this.performCalculation(
            parseFloat(this.prevValue), 
            parseFloat(this.currentValue), 
            this.operator
        );

        this.historyElement.innerText = `${this.prevValue} ${this.operator} ${this.currentValue} =`;
        this.currentValue = `${parseFloat(result.toFixed(7))}`;
        this.prevValue = '';
        this.operator = null;
        this.waitingForSecondOperand = false;
    }

    clear() {
        this.currentValue = '0';
        this.prevValue = '';
        this.operator = null;
        this.waitingForSecondOperand = false;
        this.historyElement.innerText = '';
    }

    backspace() {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
    }

    updateUI() {
        this.displayElement.innerText = this.currentValue;
        
        // Highlight active operator
        document.querySelectorAll('.btn-operator').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.value === this.operator && this.waitingForSecondOperand);
        });
    }
}

// Initialize the Calculator
const luxeCalc = new Calculator();