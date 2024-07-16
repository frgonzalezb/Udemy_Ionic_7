import { Component, OnInit } from '@angular/core';
import { Cell } from '../models/cell';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  public board!: Cell[][] | null[][];

  public rows!: number[];
  public cols!: number[];

  constructor() { }

  ngOnInit() {
    this.board = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null]
    ];
    this.rows = Array(4).fill(0);
    this.cols = Array(4).fill(0);
  }

}
