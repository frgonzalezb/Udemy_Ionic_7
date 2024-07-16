import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Cell } from '../models/cell';
import { GestureController, GestureDetail } from '@ionic/angular';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements AfterViewInit {

  @ViewChild('gameBoard', { read: ElementRef }) gameBoard!: ElementRef;

  public board: Cell[][] | null[][];

  public rows: number[];
  public cols: number[];

  constructor(
    private gestureCtrl: GestureController
  ) {
    this.board = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null]
    ];
    this.rows = Array(4).fill(0);
    this.cols = Array(4).fill(0);
  }

  ngAfterViewInit(): void {
    // horizontal
    const horizontalSwipe = this.gestureCtrl.create({
      el: this.gameBoard.nativeElement,
      gestureName: 'hswipe',
      maxAngle: 30,
      direction: 'x',
      onEnd: (detail) => {
        this.onHSwipe(detail);
      }
    }, true);

    // vertical
    const verticalSwipe = this.gestureCtrl.create({
      el: this.gameBoard.nativeElement,
      gestureName: 'vswipe',
      maxAngle: 30,
      direction: 'y',
      onEnd: (detail) => {
        this.onVSwipe(detail);
      }
    }, true);

    /* NOTA: Por alguna razón (posiblemente un bug), verticalSwipe debe
    estar antes de horizontalSwipe para que funcione todo correctamente. */
    verticalSwipe.enable();
    horizontalSwipe.enable();
  }

  onHSwipe(detail: GestureDetail) {
    console.log('Horizontal swipe: ', detail); // dbg
  }

  onVSwipe(detail: GestureDetail) {
    console.log('Vertical swipe: ', detail); // dbg
  }

}
