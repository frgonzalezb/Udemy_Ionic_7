import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { ClearPayment, CreatePaymentSheet } from './stripe.actions';
import Payment from 'src/app/models/payment';
import { StripeService } from './stripe.service';

export class StripeStateModel {
  payment!: Payment | null;
}

const defaults = {
  payment: null
};

@State<StripeStateModel>({
  name: 'stripe',
  defaults
})
@Injectable()
export class StripeState {

  @Selector()
  static getPayment(state: StripeStateModel) {
    return state.payment;
  }

  constructor(private _stripe: StripeService) {}

  @Action(CreatePaymentSheet)
  async createPaymentSheet({ setState }: StateContext<StripeStateModel>, { payload }: CreatePaymentSheet) {
    const payment = await this._stripe.createPaymentSheet(payload.paymentAttempt);
    if (payment) {
      setState({
        payment
      });
    }
  }

  @Action(ClearPayment)
  clearPayment({ setState }: StateContext<StripeStateModel>) {
    setState({
      payment: null
    });
  }

}
