import { Component } from '@angular/core';

@Component({
  selector: 'app-calculator',
  imports: [],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
})
export class Calculator {
  display: string = '0';

  append(value: string) {
    if (this.display === '0') {
      this.display = value;
    } else {
      this.display += value;
    }
  }
}
