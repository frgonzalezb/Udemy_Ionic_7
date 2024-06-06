import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { CreateOrder } from './orders.actions';
import { OrdersService } from './orders.service';

export class OrdersStateModel {
  public success!: boolean;
}

const defaults = {
  success: false
};

@State<OrdersStateModel>({
  name: 'orders',
  defaults
})
@Injectable()
export class OrdersState {

  @Selector()
  static success(state: OrdersStateModel) {
    return state.success;
  }

  constructor(private _orders: OrdersService) {}

  @Action(CreateOrder)
  async add({ getState, setState }: StateContext<OrdersStateModel>, { payload }: CreateOrder) {
    const success = await this._orders.createOrder(payload.order);
    setState({
      success
    });
  }
}
