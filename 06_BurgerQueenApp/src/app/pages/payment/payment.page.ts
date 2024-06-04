import { Component } from '@angular/core';
import { PaymentSheetEventsEnum, Stripe } from '@capacitor-community/stripe';
import { NavController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import CreatePaymentAttempt from 'src/app/models/create-payment-attempt';
import Payment from 'src/app/models/payment';
import { UserOrderService } from 'src/app/services/user-order.service';
import { CreatePaymentSheet } from 'src/app/state/stripe/stripe.actions';
import { StripeState } from 'src/app/state/stripe/stripe.state';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage {

  @Select(StripeState.getPayment) payment$!: Observable<Payment | null>;

  public showNewAccount: boolean;
  public step: number;
  public address?: string;
  public addressOption: string;
  public showNewAddress: boolean;
  private subscription: Subscription;

  constructor(
    public _userOrder: UserOrderService,
    private navController: NavController,
    private store: Store
  ) {
    this.showNewAccount = false;
    this.step = 1;
    this.subscription = new Subscription();
    this.addressOption = 'address-default';
    this.showNewAddress = false;
  }

  ionViewWillEnter() {
    this.showNewAccount = false;
    this.step = 1;
    this.subscription = new Subscription();
    this.addressOption = 'address-default';
    this.showNewAddress = false;
    this.changeAddress();
    Stripe.initialize({ publishableKey: environment.publicKey });
    this.detectChangesInPayment();
  }

  newAccount() {
    this.showNewAccount = true;
  }

  showLogin() {
    this.showNewAccount = false;
  }

  prevStep() {
    this.step--;
  }

  nextStep() {
    this.step++;
  }

  goBackHome() {
    this.navController.navigateForward('categories');
  }

  changeAddress() {
    switch(this.addressOption) {
      case 'address-default':
        this.showNewAddress = false;
        this.address = this._userOrder.getUser().address;
        break;
      case 'choose-address':
        this.showNewAddress = true;
        this.address = '';
        break;
    }
  }

  payWithStripe() {
    /*
    customer_id es de prueba, naturalmente el manejo de esto debería ser
    más apropiado en el mundo real (nada de hardcoding)
    */
    const total = this._userOrder.getTotalOrder() * 100;

    const paymentAttempt: CreatePaymentAttempt = {
      secretKey: environment.secretKey,
      amount: +total.toFixed(0),
      currency: 'EUR',
      customer_id: 'cus_QEYFPzE4ku88hN'
    };

    this.store.dispatch(new CreatePaymentSheet({ paymentAttempt }));
  }

  detectChangesInPayment() {
    const sub = this.payment$.subscribe({
      next: () => {
        const payment = this.store.selectSnapshot(StripeState.getPayment);
        if (payment) {
          // abrir la ventana modal de pago
          Stripe.createPaymentSheet(payment);
          Stripe.presentPaymentSheet().then((result) => {
            console.log(result); // dbg
            if (result.paymentResult == PaymentSheetEventsEnum.Completed) {
              // el pago se ha realizado con éxito!!
            }
          });
        }
      }
    });
    this.subscription.add(sub);
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

}
