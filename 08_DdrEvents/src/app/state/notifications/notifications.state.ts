import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { NotificationsAction } from './notifications.actions';
import { NotificationsService } from './notifications.service';

export class NotificationsStateModel {
  public success: boolean = false;
}

const defaults = {
  success: false
};

@State<NotificationsStateModel>({
  name: 'notifications',
  defaults
})
@Injectable()
export class NotificationsState {

  @Selector()
  static success(state: NotificationsStateModel) {
    return state.success;
  }

  constructor(private _notifications: NotificationsService) {

  }

  @Action(NotificationsAction)
  add({ getState, setState }: StateContext<NotificationsStateModel>, { payload }: NotificationsAction) {
    const state = getState();
    setState({ items: [ ...state.items, payload ] });
  }

}
