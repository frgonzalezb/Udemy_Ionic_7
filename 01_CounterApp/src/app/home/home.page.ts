import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public n: number;
  public showNumber: string;

  constructor() {
    this.n = 0;
    this.showNumber = '000';
  }

  formatNumber() {
    if (this.n > 0 && this.n < 10) {
      this.showNumber = '00' + this.n;
    }

    if (this.n >= 10 && this.n < 100) {
      this.showNumber = '0' + this.n;
    }

    if (this.n >= 100) {
      this.showNumber = this.n.toString();
    }

    if (this.n === 0) {
      this.reset();
    }
  }

  goUp() {
    this.n++;
    this.formatNumber()
  }

  goDown() {
    this.n--;
    this.formatNumber()
  }

  reset() {
    this.n = 0
    this.showNumber = '000'
  }

}
