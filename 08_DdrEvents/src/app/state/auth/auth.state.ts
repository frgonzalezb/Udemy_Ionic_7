import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { CheckUserIsLoggedIn, Login, Logout } from './auth.actions';
import { AuthService } from './auth.service';
import { onAuthStateChanged } from '@angular/fire/auth';

export class AuthStateModel {
  public isLogged!: boolean;
}

const defaults = {
  isLogged: false
};

@State<AuthStateModel>({
  name: 'auth',
  defaults
})
@Injectable()
export class AuthState {

  @Selector()
  static isLogged(state: AuthStateModel) {
    return state.isLogged;
  }

  constructor(private _auth: AuthService) { }

  @Action(Login)
  async login({ setState }: StateContext<AuthStateModel>, { payload }: Login) {
    try {
      const response = await this._auth.login(payload.email, payload.password);
      if (response) {
        setState({
          isLogged: true
        });
      } else {
        setState({
          isLogged: false
        });
      }
    } catch (error) {
      console.error(error); // dbg
      setState({
        isLogged: false
      });
    }
  }

  @Action(Logout)
  async logout({ setState }: StateContext<AuthStateModel>) {
    try {
      await this._auth.logout();
      setState({
        isLogged: false
      });
    } catch (error) {
      console.error(error); // dbg
      setState({
        isLogged: true
      });
    }
  }

  @Action(CheckUserIsLoggedIn)
  async checkUserIsLoggedIn({ setState }: StateContext<AuthStateModel>) {
    onAuthStateChanged(this._auth.getAuth(), user => {
      if (user) {
        setState({
          isLogged: true
        });
      } else {
        setState({
          isLogged: false
        });
      }
    });
  }
}
