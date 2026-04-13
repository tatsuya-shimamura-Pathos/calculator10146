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
  plusMinusReset: boolean = true;
  ratio: string = '';
  operand: string = '';
  isPercentOn: boolean = false;
  isCancel: boolean = false;

  append(value: string): void {
    if (this.display !== '' && this.alert === '') {
      if (this.reset) {
        if (value !== '.') {
          if (this.isPercentOn) {
            this.result = 0;
          }
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
          if (this.plusMinusReset) {
            this.plusMinus = '';
          }
          this.plusMinusReset = false;
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
      this.isPercentOn = false; //50%====のケース
      if (this.lastOperator === '+' || this.lastOperator === '-') { // 1-2+5===、1+4-2===のケース
        this.operand = this.plusMinus + this.display;
      }
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
    const decimalDigits = this.display.split('.')[1]?.length
    if (integralDigits > 10) {
      this.doAlert(`※整数部の桁数：${integralDigits}桁、桁数上限(10桁)超過`);
    }
    if (decimalDigits > 8) {
      this.display = `${this.display.split('.')[0]}.${this.display.split('.')[1]?.slice(0, 8)}`;
      this.display = Number(this.display).toFixed(8);
    }
  }

  setComma(): void {
    if (!this.display.includes('.')) {
      this.display += '.';
    }
  }

  percentCalc(): void{;
    if (this.display !== '') {
      if (this.calcData.length === 0) {
        if (this.lastOperator !== '') { // %連打のケース
          switch (this.lastOperator) {
            case '+':
            case '-':
              break;
            case '*':
              this.calcData.push(this.ratio, this.lastOperator);
              this.calculate();
              break;
            default:  
              // this.calcData.push(this.plusMinus + this.display, this.lastOperator); // 200/50%%%%のケースのために一旦削除
              // this.display = this.lastNumber; // 200/50%%%%のケースのために一旦削除
              this.calculate();
              this.display = (Number(this.display) * 100).toFixed(8); // 200/50%%%%のケース
              this.endZeroCut();
              break;
          }
        } else { // 初回%のケース
          this.display = '0.';
        }
      } else {
          switch (this.lastOperator) {
            case '+':
            case '-':
              if (this.result !== 0) {
                if (!this.isPercentOn) { // 連続して%を計算する場合を想定（100+50%、200-50%）
                  this.display = ((Number(this.display)) / 100 * this.result).toFixed(8);
                  this.operand = this.result.toFixed(8); // 100+100+50%====のケース
                } else {
                  this.display = ((Number(this.display)) / 100 * this.result).toFixed(8);
                  this.operand = this.result.toFixed(8); // 100+100+50%====のケース
                }
              }
              if (this.result === 0) {
                this.display = ((Number(this.display)) / 100 * Number(this.lastNumber)).toFixed(8);
                this.operand = this.lastNumber; // 100+25%====のケース            
              }
              break;
            case '*':
            case '/':
              this.display = ((Number(this.display)) / 100).toString();
              break;
          }
        this.calculate();
        // this.ratio = (Number(this.display) / Number(this.lastNumber) / 100).toFixed(8)
        // this.ratio = (Number(this.lastNumber) / 100).toFixed(8) // 200*50%%%%のケース
        this.ratio = '0.01'; // 200*50%%%%のケース
      }
      this.isOperatorInput = false;
      this.isNumberInput = false;
      this.isEqual = false;
      this.isPercentOn = true;
      this.isCancel = false;
    }
  }

  rootCalc(): void {
    if (this.display !== '') {
      if (this.plusMinus === '-') {
        this.doAlert('※+/-ボタンによるマイナス数値の平方根は計算不可');
      }
      this.display = Math.sqrt(Number(this.display)).toString();
      if (this.lastOperator === '*') { // 200*50%√====のケース
        this.operand = this.lastNumber;
      } else {
        this.operand = this.plusMinus + this.display; // 15+9√、15-9√のケース
      }
      this.setComma();
      this.validateCulcResult();
      this.endZeroCut();
      this.reset = true;
      this.isOperatorInput = false;
      this.isNumberInput = true; // +√、-√、*√、/√のケース
      this.isEqual = false;
    }
  }

  // clickOperator(operator: string): void {
  //   if (this.display !== '' && this.alert === '') {
  //     let signedData: string;
  //     if (this.calcData.length === 0) {
  //       signedData = this.plusMinus + this.display;
  //       this.calcData.push(signedData, operator);
  //       this.lastOperator = operator;
  //       this.lastNumber = signedData;
  //     } else {
  //       if (this.isNumberInput) {
  //         const signedData: string = this.plusMinus + this.display;
  //         this.calcData.push(signedData, operator);
  //         if (this.calcData.length > 2 && this.calcData.length % 2 === 0) {
  //           this.calcData.pop();
  //           this.calculate("clickOperator");
  //           this.calcData.push(operator);
  //         }
  //       } else {
  //         this.calcData[this.calcData.length - 1] = operator; // 直前の演算子を更新
  //         this.lastOperator = operator;
  //       }
  //     }
  //     if (operator === '*') {
  //       this.multiplier = this.plusMinus + this.display;
  //     }
  //     this.reset = true;
  //     this.isPoint = false;
  //     this.isNumberInput = false;
  //     this.isEqual = false;
  //     this.isOperatorInput = true;
  //   }
  // }


  clickOperator(operator: string): void {
    if (this.display !== '' && this.alert === '') {
      let signedData: string;
      this.lastOperator = operator;
      if (this.calcData.length === 0) {
        signedData = this.plusMinus + this.display;
        this.calcData.push(signedData, operator);
        this.lastNumber = signedData;
      } else {
        if (this.isNumberInput) {
          const signedData: string = this.plusMinus + this.display;
          this.lastNumber = signedData;
          this.calcData.push(signedData, operator);
          if (this.calcData.length > 2 && this.calcData.length % 2 === 0) {
            this.calcData.pop(); //一度末尾の演算子を削除してcalculate()で計算する。
            this.calculate("clickOperator");
            this.calcData.push(operator);
          }
        } else {
          this.calcData[this.calcData.length - 1] = operator; // 直前の演算子を更新
        }
      }
      if (operator === '*' || operator === '+' || operator === '-') {
        this.operand = this.plusMinus + this.display;
      }
      this.reset = true;
      this.isPoint = false;
      this.isNumberInput = false;
      this.isEqual = false;
      this.isOperatorInput = true;
    }
  }

  clear(): void {
    if (this.display !== '') {
      this.display = '0.';
      this.isNumberInput = false;
      this.isEqual = false;
      this.isPoint = false;
      this.isCancel = true;
      if (this.alert === '') {
        this.plusMinus = '';
      }
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
    this.plusMinusReset = true;
    this.ratio = '';
    this.operand = '';
    this.isPercentOn = false;
    this.isCancel = false;
  }

  doAlert(message: string): void {
    this.clearAll();
    this.alert = message;
    this.plusMinus = '\nE';
  }

  appendPlusMinus(): void {
    if (this.display !== '' && this.alert === '') {
      if (this.plusMinus === '') {
        this.plusMinus = '-';
      } else {
        this.plusMinus = '';
      }
      if (this.calcData.length > 0 && this.isOperatorInput) { // 直前に演算子を入力した場合の処理
        this.calcData[this.calcData.length - 2] = this.plusMinus + this.display;
      }
      if (this.lastOperator === '+' || this.lastOperator === '-') { // 1-2+5===、1+4-2===のケース
        this.operand = this.plusMinus + this.display;
      }
      this.isEqual = false;
      // this.isNumberInput = false; // 1+2+/-*5が計算できなくなるためコメントアウト
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
    // if (this.display !== '' && this.lastNumber !== '' && this.alert === '' && !this.isCancel) {
    if (this.display !== '' && this.lastNumber !== '' && this.alert === '') {      
      if (!functionName){
        const signedData: string = this.plusMinus + this.display;
        this.calcData.push(signedData);
      }
      // +=, -=, *=, /=のケース（*=はここでは制御不要）
      if (this.isOperatorInput) {
        switch (this.calcData[this.calcData.length - 2]) {
          case '+':
            if (this.calcData.length < 5) {
              this.calcData[0] = '0';
            }
            this.calcData[this.calcData.length - 1] = this.lastNumber;
            this.lastNumber = this.display;
            break;
          case '-':
            if (this.calcData.length < 5) {
              this.calcData[0] = '0';
            }
            this.calcData[this.calcData.length -1] = this.lastNumber;
            this.lastNumber = this.display;
            break;
          case '*':
            this.lastNumber = this.calcData[this.calcData.length - 1];
            break;
          case '/':
            this.calcData= ['1', '/', this.display]
            break;
          default:
            break;
        }
      }
      this.calcDetail();
      const index = this.calcData.indexOf('/');
      if (index !== -1 && Number(this.calcData[index + 1]) === 0) {
        this.doAlert('※0除算');
      } else {
        if (this.isEqual || this.isPercentOn) {
          if (this.lastOperator === '*' || this.lastOperator === '+' || this.lastOperator === '-') { //*=、+=、-=のケース
            if (this.isCancel) {
              this.calcData.push(this.lastOperator, this.lastNumber); // 12+3CE====のケース         
            } else {
            this.calcData.push(this.lastOperator, this.operand);
            }
          } else {
            this.calcData.push(this.lastOperator, this.lastNumber);
          }
          this.calcDetail();
          if (this.lastOperator === '/' && this.isPercentOn) {
            this.result = this.result / 100;
          }
        }
        this.convertingFromExponentialNotation();
        this.resultPlusMinusControl();
        // this.lastOperator = this.calcData[this.calcData.length - 2];
        if (!this.isOperatorInput) {
          switch (this.lastOperator) {
            case '+':
            case '-':
            case '/': // 40+60/2====のケース
              this.lastNumber = this.calcData[this.calcData.length - 1];
              break;
          }
        } else {
            switch (this.lastOperator) {
              case '-':
                if (this.calcData.length >= 5) {
                  if (this.plusMinus === '') {
                    this.plusMinus = '-';
                  } else {
                    this.plusMinus = '';
                  }
                }           
                break;
              case '/':
                this.lastNumber = this.calcData[this.calcData.length - 1];
                break;
            }
          }
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
    if (!functionName) {
      if (this.alert === '' && ((this.calcData.length === 0 && this.display === '0.'))) {
        this.plusMinus = '';        
      }
      // if (this.isCancel) {
      //   this.calcData.push('0.');
      //   this.calcDetail();
      //   const index = this.calcData.indexOf('/');
      //   if (index !== -1 && Number(this.calcData[index + 1]) === 0) {
      //     this.doAlert('※0除算');
      //   }
      // }
      this.calcData = [];
      this.reset = true;
      this.isEqual = true;
    }
    this.endZeroCut();
    this.isOperatorInput = false;
  }  
}