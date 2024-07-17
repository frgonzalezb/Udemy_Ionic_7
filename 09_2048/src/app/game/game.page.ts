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

  private DIRECTION_UP = 0;
  private DIRECTION_DOWN = 1;
  private DIRECTION_LEFT = 2;
  private DIRECTION_RIGHT = 3;

  private direction!: number;

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
    this.generateRandomNumber();
    this.generateRandomNumber();
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

    if (detail.deltaX < 0) {
      console.info('¡Has deslizado hacia la izquierda!');
      this.direction = this.DIRECTION_LEFT;
      this.moveLeft();
    } else {
      console.info('¡Has deslizado hacia la derecha!');
      this.direction = this.DIRECTION_RIGHT;
      this.moveRight();
    }
  }

  onVSwipe(detail: GestureDetail) {
    console.log('Vertical swipe: ', detail); // dbg

    if (detail.deltaY < 0) {
      console.info('¡Has deslizado hacia arriba!');
      this.direction = this.DIRECTION_UP;
      this.moveUp();
    } else {
      console.info('¡Has deslizado hacia abajo!');
      this.direction = this.DIRECTION_DOWN;
      this.moveDown();
    }
  }

  generateRandomNumber() {
    let row = 0;
    let col = 0;

    do {
      row = Math.floor(Math.random() * this.board.length);
      col = Math.floor(Math.random() * this.board[0].length);
    } while (this.board[row][col] !== null);

    this.board[row][col] = new Cell();

    const probNum4 = Math.floor(Math.random() * 100) + 1;

    if (probNum4 <= 25) {
      this.board[row][col]!.value = 4;
    } else {
      this.board[row][col]!.value = 2;
    }
  }

  moveLeft() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 1; j < this.board[i].length; j++) {
        
      }
      
    }
  }

  moveRight() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = this.board[i].length - 2; j >= 0; j--) {
        
      }
      
    }
  }

  moveUp() {
    for (let i = 1; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        
      }
      
    }
  }

  moveDown() {
    for (let i = this.board.length - 2; i >= 0; i--) {
      for (let j = 0; j < this.board[i].length; j++) {
        
      }
      
    }
  }

  nextFreePosition(ogRow: number, ogCol: number, ogNumber: number) {
    let newRow: number;
    let newCol: number;
    let found: boolean = false;

    switch(this.direction) {
      
      // a Boric
      case this.DIRECTION_LEFT:
        newRow = ogRow;
        for (let j = ogCol - 1; j >= 0 && !found; j--) {
          if (this.board[ogRow][j] !== null) {
            found = true;

            if (this.board[ogRow][j]!.blocked) {
              // si la caja está bloqueada
              newCol = j + 1;
            } else if (this.board[ogRow][j]!.value === ogNumber) {
              // si ambas cajas tienen el mismo número
              newCol = j;
              
            } else if ((j + 1) !== ogCol) {
              // si la nueva caja ya tiene otro número
              newCol = j + 1;
            }
          } 
          
        }
        if (!found) {
          newCol = 0;
        }
        break;

      // a Milei
      case this.DIRECTION_RIGHT:
        newRow = ogRow;
        for (let j = ogCol + 1; j < this.board[ogRow].length && !found; j++) {
          if (this.board[ogRow][j] !== null) {
            found = true;

            if (this.board[ogRow][j]!.blocked) {
              // si la caja está bloqueada
              newCol = j - 1;
            } else if (this.board[ogRow][j]!.value === ogNumber) {
              // si ambas cajas tienen el mismo número
              newCol = j;
              
            } else if ((j - 1) !== ogCol) {
              // si la nueva caja ya tiene otro número
              newCol = j - 1;
            }
          } 
          
        }
        if (!found) {
          newCol = this.board[ogRow].length - 1;
        }
        break;
      case this.DIRECTION_UP:
        break;
      case this.DIRECTION_DOWN:
        break;
    }
  }

}
