import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Login } from './auth.actions';
import { AuthService } from './auth.service';
import UserToken from 'src/app/models/user-token';
import { Preferences } from '@capacitor/preferences';
import { KEY_TOKEN } from 'src/app/constants/constants';

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
  async login({ getState, setState }: StateContext<AuthStateModel>, { payload }: Login) {
    const token = await this._auth.login(payload.email, payload.password);
    if (token) {
      Preferences.set({
        key: KEY_TOKEN, value: token.accessToken
      });
      setState({
        success: true
      });
    } else {
      setState({
        success: false
      });
    }
  }
}
