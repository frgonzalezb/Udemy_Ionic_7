import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Cell } from '../models/cell';
import { GestureController, GestureDetail } from '@ionic/angular';
import { AlertService } from '../services/alert.service';
import { TranslateService } from '@ngx-translate/core';

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

  private hasMovement: boolean;

  public points: number;
  private roundPoints: number;

  constructor(
    private gestureCtrl: GestureController,
    private _alert: AlertService,
    private _translate: TranslateService
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
    this.hasMovement = false;
    this.points = 0;
    this.roundPoints = 0;
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

  onHSwipe(detail: GestureDetail): void {
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

    this.checkMovement();
  }

  onVSwipe(detail: GestureDetail): void {
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

    this.checkMovement();
  }

  generateRandomNumber(): void {
    let row = 0;
    let col = 0;

    do {
      row = Math.floor(Math.random() * this.board.length);
      col = Math.floor(Math.random() * this.board[0].length);
    } while (this.board[row][col] !== null);

    this.board[row][col] = new Cell();

    const probNum4 = Math.floor(Math.random() * 100) + 1;

    if (probNum4 <= 25) {
      this.board[row][col]!.value = 1024; // 4, en caso de modificar por dbg
    } else {
      this.board[row][col]!.value = 1024; // 2, en caso de modificar por dbg
    }
  }

  moveLeft(): void {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 1; j < this.board[i].length; j++) {
        this.processPosition(i, j);
      }
    }
  }

  moveRight(): void {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = this.board[i].length - 2; j >= 0; j--) {
        this.processPosition(i, j);
      }
    }
  }

  moveUp(): void {
    for (let i = 1; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        this.processPosition(i, j);
      }
    }
  }

  moveDown(): void {
    for (let i = this.board.length - 2; i >= 0; i--) {
      for (let j = 0; j < this.board[i].length; j++) {
        this.processPosition(i, j);
      }
    }
  }

  nextFreePosition(ogRow: number, ogCol: number, ogNumber: number): number[] | null {
    let newRow!: number;
    let newCol!: number;
    let found!: boolean;

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
      
      // a San Pedro
      case this.DIRECTION_UP:
        newCol = ogCol;
        for (let i = ogRow - 1; i >= 0 && !found; i--) {
          if (this.board[i][ogCol] !== null) {
            found = true;

            if (this.board[i][ogCol]!.blocked) {
              // si la caja está bloqueada
              newRow = i + 1;
            } else if (this.board[i][ogCol]!.value === ogNumber) {
              // si ambas cajas tienen el mismo número
              newRow = i;
            } else if ((i + 1) !== ogRow) {
              // si la nueva caja ya tiene otro número
              newRow = i + 1;
            }
          }
        }
        if (!found) {
          newRow = 0;
        }
        break;

      // a don Sata
      case this.DIRECTION_DOWN:
        newCol = ogCol;
        for (let i = ogRow + 1; i < this.board.length && !found; i++) {
          if (this.board[i][ogCol] !== null) {
            found = true;

            if (this.board[i][ogCol]!.blocked) {
              // si la caja está bloqueada
              newRow = i - 1;
            } else if (this.board[i][ogCol]!.value === ogNumber) {
              // si ambas cajas tienen el mismo número
              newRow = i;
            } else if ((i - 1) !== ogRow) {
              // si la nueva caja ya tiene otro número
              newRow = i - 1;
            }
          }
        }
        if (!found) {
          newRow = this.board.length - 1;
        }
        break;
    }

    if (newRow !== undefined && newCol !== undefined) {
      return [newRow, newCol];
    }

    return null;
  }

  processPosition(i: number, j: number): void {
    const cell = this.board[i][j];
    if (cell !== null) {
      const nextPosition = this.nextFreePosition(i, j, cell.value);
      if (nextPosition !== null) {
        const row = nextPosition[0];
        const col = nextPosition[1];
        if (!this.board[row][col]) {
          this.board[row][col] = new Cell();
        }
        if (cell.value === this.board[row][col]!.value) {
          const points = cell.value * 2;
          this.board[row][col]!.value = points;
          this.board[row][col]!.blocked = true; // sólo sumar los 2 primeros
          this.points += points;
          this.roundPoints += points;
        } else {
          this.board[row][col] = cell;
        }
        
        this.board[i][j] = null; // reiniciar la celda actual
        this.hasMovement = true;
      }
    }
  }

  clearBlockedCells(): void {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] !== null) {
          this.board[i][j]!.blocked = false;
        }
      }
    }
  }

  checkMovement(): void {
    if (this.checkPlayerHasWonGame()) {
      console.info('¡Has ganado la partida!');

      const buttons = [
        {
          text: this._translate.instant('label.new.game'),
          handler: () => {
            // this.newGame();
          }
        },
        {
          text: this._translate.instant('label.share'),
          handler: () => {
            // this.share();
          }
        },
      ];

      const backdropDismiss = false;

      this._alert.alertCustomButtons(
        this._translate.instant('label.win.game.title'),
        this._translate.instant('label.game.content', { points: this.points }),
        buttons,
        backdropDismiss
      );
    } else if (this.hasMovement) {
      this.generateRandomNumber();
      this.hasMovement = false; // reiniciar propiedad
      this.roundPoints = 0;
      this.clearBlockedCells();
    }
  }

  checkPlayerHasWonGame(): boolean {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] !== null && this.board[i][j]!.value === 2048) {
          return true;
        } else {
          
        }
      }
    }
    return false;
  }

}
