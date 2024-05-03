import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Login } from './auth.actions';
import { AuthService } from './auth.service';

export class AuthStateModel {
  public success!: boolean;
}

const defaults = {
  success: false
};

@State<AuthStateModel>({
  name: 'auth',
  defaults
})
@Injectable()
export class AuthState {

  @Selector()
  static success(state: AuthStateModel) {
    return state.success;
  }

  constructor(private _auth: AuthService) {}

  @Action(Login)
  login({ getState, setState }: StateContext<AuthStateModel>, { payload }: Login) {
  }
}
