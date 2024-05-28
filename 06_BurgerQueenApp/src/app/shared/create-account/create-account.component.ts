import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import User from 'src/app/models/user';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule],
})
export class CreateAccountComponent {

  @Output() back: EventEmitter<boolean>;
  @Output() doCreateAccount: EventEmitter<boolean>;

  public user: User;

  constructor() {
    this.back = new EventEmitter<boolean>();
    this.doCreateAccount = new EventEmitter<boolean>();
    this.user = new User();
  }

  createAccount() {

  }

  exit() {
    this.back.emit(true);
  }

}
