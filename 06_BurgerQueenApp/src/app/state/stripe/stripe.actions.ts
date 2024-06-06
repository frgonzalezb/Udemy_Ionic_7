import CreatePaymentAttempt from "src/app/models/create-payment-attempt";

// Modal para introducir los datos del medio de pago (tarjeta)
export class CreatePaymentSheet {
  static readonly type = '[Stripe] Create payment sheet';
  constructor(public payload: { paymentAttempt: CreatePaymentAttempt }) { }
}

export class ClearPayment {
  static readonly type = '[Stripe] Clear payment';
}
