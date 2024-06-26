import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import User from 'src/app/models/user';
import { ToastService } from 'src/app/services/toast.service';
import { Login } from 'src/app/state/auth/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  public user: User;

  constructor(
    private store: Store,
    private _toast: ToastService,
    private _translate: TranslateService
  ) {
    this.user = new User();
  }

  login() {
    this.store.dispatch(new Login({
      email: this.user.email,
      password: this.user.password
    })).subscribe({
      next: () => {
        const isLoggedIn = this.store.selectSnapshot(state => state.auth.isLoggedIn);
        if (isLoggedIn) {
          this._toast.showToast(this._translate.instant('label.login.success'));
        } else {
          this._toast.showToast(this._translate.instant('label.login.credentials.error'));
        }
      }, error: () => {
        this._toast.showToast(this._translate.instant('label.login.error'));
      }
    });
  }

}
