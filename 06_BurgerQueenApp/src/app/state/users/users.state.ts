import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { CreateUser, GetUser } from './users.actions';
import { UsersService } from './users.service';
import { UserOrderService } from 'src/app/services/user-order.service';

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

  constructor(private _users: UsersService, private _userOrder: UserOrderService) { }

  @Action(GetUser)
  async getUser({ }: StateContext<UsersStateModel>, { payload }: GetUser) {
    const user = await this._users.getUser(payload.email);
    if (user) {
      await this._userOrder.saveUser(user);
    }
  }

  @Action(CreateUser)
  async createUser({ setState }: StateContext<UsersStateModel>, { payload }: CreateUser) {
    const success = await this._users.createUser(payload.user);
    setState({
      success
    });
  }
}
