import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import CreatePaymentAttempt from 'src/app/models/create-payment-attempt';
import Payment from 'src/app/models/payment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor() { }

  createPaymentSheet(paymentAttempt: CreatePaymentAttempt) {
    return CapacitorHttp.post({
      url: environment.urlApi + 'stripe/intent',
      params: {
        
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${paymentAttempt.secretKey}`
      },
      data: {
        ...paymentAttempt
      }
    }).then((response: HttpResponse) => {
      if (response.status === 201) {
        const data = response.data as Payment;
        return data
      }
      return null;
    }).catch(error => {
      console.error(error);
      return null;
    });
  }
}
