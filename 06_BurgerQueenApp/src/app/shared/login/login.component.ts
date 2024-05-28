import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { ToastService } from 'src/app/services/toast.service';
import { Login } from 'src/app/state/auth/auth.actions';
import { AuthState } from 'src/app/state/auth/auth.state';
import User from 'src/app/models/user';
import { GetUser } from 'src/app/state/users/users.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule],
})
export class LoginComponent {

  @Input() showback: boolean = true;

  @Output() newAccount: EventEmitter<boolean>;
  @Output() back: EventEmitter<boolean>;
  @Output() doLogin: EventEmitter<boolean>;

  public user: User;

  constructor(
    private store: Store,
    private _toast: ToastService,
    private _translate: TranslateService
  ) {
    this.user = new User();
    this.newAccount = new EventEmitter<boolean>();
    this.back = new EventEmitter<boolean>();
    this.doLogin = new EventEmitter<boolean>();
  }

  login() {
    this.store.dispatch(new Login({
      email: this.user.email,
      password: this.user.password ? this.user.password : ''
    })).subscribe({
      next: () => {
        const success = this.store.selectSnapshot(AuthState.success);
        if (success) {
          this._toast.showToast(this._translate.instant('label.login.success'));
          this.store.dispatch(new GetUser({ email: this.user.email }));
          this.doLogin.emit(true);
        } else {
          this._toast.showToast(this._translate.instant('label.login.error'));
        }
      }, error: (e) => {
        console.error(e);
        this._toast.showToast(this._translate.instant('label.login.error'));
      }
    });
  }

  exit() {
    this.back.emit(true);
  }

  createNewAccount() {
    this.newAccount.emit(true);
  }

}
