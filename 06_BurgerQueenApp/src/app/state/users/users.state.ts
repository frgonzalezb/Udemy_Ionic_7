import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { GetUser } from './users.actions';
import { UsersService } from './users.service';

export class UsersStateModel {
  success!: boolean;
}

const defaults = {
  success: false
};

@State<UsersStateModel>({
  name: 'users',
  defaults
})
@Injectable()
export class UsersState {

  @Selector()
  static success(state: UsersStateModel) {
    return state.success;
  }

  constructor(private _users: UsersService) { }

  @Action(GetUser)
  add({ getState, setState }: StateContext<UsersStateModel>, { payload }: GetUser) {
    
  }
}
