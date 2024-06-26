import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { CheckUserIsLoggedIn, Login, Logout } from './auth.actions';
import { AuthService } from './auth.service';
import { onAuthStateChanged } from '@angular/fire/auth';

export class AuthStateModel {
  public isLoggedIn!: boolean;
}

const defaults = {
  isLoggedIn: false
};

@State<AuthStateModel>({
  name: 'auth',
  defaults
})
@Injectable()
export class AuthState {

  @Selector()
  static isLoggedIn(state: AuthStateModel) {
    return state.isLoggedIn;
  }

  constructor(private _auth: AuthService) { }

  @Action(Login)
  async login({ setState }: StateContext<AuthStateModel>, { payload }: Login) {
    try {
      const response = await this._auth.login(payload.email, payload.password);
      if (response) {
        setState({
          isLoggedIn: true
        });
      } else {
        setState({
          isLoggedIn: false
        });
      }
    } catch (error) {
      console.error(error); // dbg
      setState({
        isLoggedIn: false
      });
    }
  }

  @Action(Logout)
  async logout({ setState }: StateContext<AuthStateModel>) {
    try {
      await this._auth.logout();
      setState({
        isLoggedIn: false
      });
    } catch (error) {
      console.error(error); // dbg
      setState({
        isLoggedIn: true
      });
    }
  }

  @Action(CheckUserIsLoggedIn)
  async checkUserIsLoggedIn({ setState }: StateContext<AuthStateModel>) {
    onAuthStateChanged(this._auth.getAuth(), user => {
      if (user) {
        setState({
          isLoggedIn: true
        });
      } else {
        setState({
          isLoggedIn: false
        });
      }
    });
  }
}
