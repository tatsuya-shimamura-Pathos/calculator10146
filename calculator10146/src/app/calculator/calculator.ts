import { Component } from '@angular/core';

@Component({
  selector: 'app-calculator',
  imports: [],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
})

export class Calculator {
  plusMinus: string = '';
  display: string = '';
  calcData: string[] = [];
  isPoint: boolean = false;
  result: number = 0;
  reset: boolean = false;
  isNumberInput: boolean = false;
  alert: string = '';
  isEqual: boolean = false;
  lastOperator: string = '';
  lastNumber: string = '';
  isOperatorInput: boolean = false;

  append(value: string): void {
    if (this.display !== '') {
      if (this.reset) {
        if (value !== '.') {
          this.alert = '';
          this.display = value;
          this.plusMinus = '';
          this.reset = false;
        }
      } else {
        if (this.display === '0.') {
          switch (value) {
            case '0':
              if (this.isPoint) {
                this.display += value;
              }
              break;
            case '.':
              this.isPoint = true;
              break;
            default:
              if (this.isPoint) {
                this.display += value;
              } else {
                this.display = value;
              }
          }
        } else {
          if (value === '.') {
            this.isPoint = true;
          } else {
            if (this.isPoint) {
              this.display += value;
            } else {
              this.display = this.display.replace('.', '');
              this.display += value;
            }
          }
        }
      }
      this.validateInput();
      this.setComma();
      this.isNumberInput = true;
      this.isEqual = false;
      this.isOperatorInput = false;
    }
  }

  validateInput(): void {
    const validationRules = /^(\d{0,10})(\.(\d{0,8})?)?$/;
    if (!validationRules.test(this.display)) {
      this.display = this.display.slice(0,-1);
    }
  }

  validateCulcResult(): void {
    const integralDigits = this.display.split('.')[0].length;
    // const decimalDigits = this.display.split('.')[1]?.length
    if (integralDigits > 10) {
      this.plusMinus = "\nE";
      this.display = '0.';
      this.alert += `※整数部の桁数：${integralDigits}桁、桁数上限(10桁)超過`;
    }
    // if (decimalDigits > 8) {
    //   // this.display = `${this.display.split('.')[0]}.${this.display.split('.')[1]?.slice(0, 8)}`;
    //   this.display = Number(this.display).toFixed(8);
    // }
  }

  setComma(): void {
    if (!this.display.includes('.')) {
      this.display += '.';
    }
  }

  percentCalc(): void{
    if (this.display !== '') {
      if (this.calcData.length === 0 || (this.calcData.length > 2 && this.result === 0)) {
        this.display = '0.';
      } else {
        switch (this.lastOperator) {
          case '+':
          case '-':
            this.display = ((Number(this.lastNumber)) / 100).toString();
            break;
          case '*':
          case '/':
            this.display = ((Number(this.display)) / 100).toString();
            break;
        }
        this.calculate();
      }
      this.isOperatorInput = false;
      this.isNumberInput = false;
      this.isEqual = false;
    }
  }

  rootCalc(): void {
    if (this.display !== '') {
      this.display = Math.sqrt(Number(this.display)).toString();
      this.setComma();
      this.reset = true;
      this.isOperatorInput = false;
      this.isNumberInput = false;
      this.isEqual = false;
    }
  }

  clickOperator(operator: string): void {
    let signedData: string;
    if (this.calcData.length === 0) {
      signedData = this.plusMinus + this.display;
      this.calcData.push(signedData, operator);
      this.lastOperator = operator;
      this.lastNumber = signedData;
    } else {
      if (this.isNumberInput) {
        const signedData: string = this.plusMinus + this.display;
        this.calcData.push(signedData, operator);
        if (this.calcData.length > 2 && this.calcData.length % 2 === 0) {
          this.calcData.pop();
          this.calculate("clickOperator");
          this.calcData.push(operator);
        }
      } else {
        this.calcData[this.calcData.length - 1] = operator; // 直前の演算子を更新
      }
    }
    this.reset = true;
    this.isPoint = false;
    this.isNumberInput = false;
    this.isEqual = false;
    this.isOperatorInput = true;
  }

  clear(): void {
    if (this.display !== '') {
      this.display = '0.';
      this.plusMinus = '';
      this.isNumberInput = false;
      this.isEqual = false;
      this.isPoint = false;
    }
  }

  clearAll(): void {
    this.plusMinus = '';
    this.display = '0.';
    this.calcData = [];
    this.isPoint = false;
    this.result = 0;
    this.reset = false;
    this.isNumberInput = false;
    this.alert = '';
    this.isEqual = false;
    this.lastOperator = '';
    this.lastNumber = '';
    this.isOperatorInput = false;
  }

  appendPlusMinus(): void {
    if (this.display !== '') {
      if (this.plusMinus === '') {
        this.plusMinus = '-';
      } else {
        this.plusMinus = '';
      }
      if (this.calcData.length > 0 && this.isOperatorInput) { // 直前に演算子を入力した場合の処理
        this.calcData[this.calcData.length - 2] = this.plusMinus + this.display;
      }
      this.isEqual = false;
      this.isNumberInput = false;
    }
  }

  convertingFromExponentialNotation(): void {
    this.display = this.result.toFixed(8);
  }

  resultPlusMinusControl() {
    if (this.display.includes('-')) {
      this.plusMinus = '-';
      this.display = this.display.replace('-', '');
    } else {
      this.plusMinus = '';
    }
  }

  endZeroCut(): void {
    let decimalDigits: string = this.display.split('.')[1];
    decimalDigits = decimalDigits.replace(/0+$/, '');
    this.display = `${this.display.split('.')[0]}.${decimalDigits}`;
  }

  calcDetail(): void {
    this.result = Number(this.calcData[0])
    let cD: number = 0;
    for (let i = 1; i < this.calcData.length; i+=2) {
      cD = Number(this.calcData[i+1]);

      switch (this.calcData[i]) {
        case '+':
          this.result += cD;
          break;
        case '-':
          this.result -= cD;
          break;
        case '*':
          this.result *= cD;
          break;
        default:
          this.result /= cD;
      }
    }
  }

  calculate(functionName?: string): void {
    if (this.display !== '' && this.lastNumber !== '') {
      if (!functionName){
        const signedData: string = this.plusMinus + this.display;
        this.calcData.push(signedData);
      }
      this.calcDetail();
      if (this.calcData.includes('/') && Number(this.calcData[this.calcData.length - 1]) === 0) {
        this.alert = '※0除算';
        this.display = '0.';
        this.plusMinus = '\nE';
      } else {
        if (this.isEqual) {
          this.calcData.push(this.lastOperator, this.lastNumber);
          this.calcDetail();
        }
        this.convertingFromExponentialNotation();
        this.resultPlusMinusControl();
        this.lastOperator = this.calcData[this.calcData.length - 2];
        this.lastNumber = this.calcData[this.calcData.length - 1];
      }
      if (!functionName) {
        this.calcData = [];
        this.reset = true;
        this.isEqual = true;
      }
      this.setComma();
      this.endZeroCut();
      this.validateCulcResult();
    }
  }  
}