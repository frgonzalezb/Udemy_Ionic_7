import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Login } from './auth.actions';
import { AuthService } from './auth.service';

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
  login({ setState }: StateContext<AuthStateModel>, { payload }: Login) {
    return this._auth.login(payload.email, payload.password).then(response => {
      if (response) {
        setState({
          isLogged: true
        });
      }
    });
  }
}
