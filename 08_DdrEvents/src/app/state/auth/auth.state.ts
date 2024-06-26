import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AuthAction } from './auth.actions';
import { AuthService } from './auth.service';

export class AuthStateModel {
  public isLogged: boolean = false;
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

  @Action(AuthAction)
  add({ getState, setState }: StateContext<AuthStateModel>, { payload }: AuthAction) {

  }
}
