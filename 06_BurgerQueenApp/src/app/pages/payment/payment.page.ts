import { Component } from '@angular/core';
import { PaymentSheetEventsEnum, Stripe } from '@capacitor-community/stripe';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import CreatePaymentAttempt from 'src/app/models/create-payment-attempt';
import Payment from 'src/app/models/payment';
import { ToastService } from 'src/app/services/toast.service';
import { UserOrderService } from 'src/app/services/user-order.service';
import { CreateOrder } from 'src/app/state/orders/orders.actions';
import { OrdersState } from 'src/app/state/orders/orders.state';
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
    private store: Store,
    private _toast: ToastService,
    private _translate: TranslateService
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

  createOrder() {
    const order = this._userOrder.getOrder();
    order.address = this.address;
    this.store.dispatch(new CreateOrder({ order })).subscribe({
      next: () => {
        const success = this.store.selectSnapshot(OrdersState.success);
        if (success) {
          this._toast.showToast(this._translate.instant('label.pay.success', {'address': this.address}));
          this._userOrder.resetOrder();
          this.goBackHome();
        } else {
          this._toast.showToast(this._translate.instant('label.pay.fail'));
        }
      }, error: (e) => {
        console.error(e);
        this._toast.showToast(this._translate.instant('label.pay.fail'));
      }
    });
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
              this.createOrder();
            } else if (result.paymentResult == PaymentSheetEventsEnum.Failed) {
              // el pago ha fallado
              this._toast.showToast(this._translate.instant('label.pay.fail'));
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
