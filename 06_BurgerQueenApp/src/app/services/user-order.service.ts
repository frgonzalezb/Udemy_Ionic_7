import { Injectable } from '@angular/core';
import Order from '../models/order';
import { Preferences } from '@capacitor/preferences';
import { KEY_ORDER } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class UserOrderService {

  private order!: Order;

  constructor() {
    this.initOrder();
  }

  async initOrder() {
    const order = await Preferences.get({ key: KEY_ORDER });
    if (!order.value) {
      this.order = new Order();
      this.order.products = [];
      this.saveOrder();
    } else {
      this.order = JSON.parse(order.value);
    }
  }

  async saveOrder() {
    await Preferences.set({ key: KEY_ORDER, value: JSON.stringify(this.order) });
  }
}
