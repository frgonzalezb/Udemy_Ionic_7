import { Injectable } from '@angular/core';
import Order from '../models/order';
import { Preferences } from '@capacitor/preferences';
import { KEY_ORDER } from '../constants/constants';
import Product from '../models/product';
import ProductQuantity from '../models/product-quantity';
import { isEqual } from 'lodash-es';

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
      this.clearOrder();
    } else {
      this.order = JSON.parse(order.value);
    }
  }

  async saveOrder() {
    await Preferences.set({ key: KEY_ORDER, value: JSON.stringify(this.order) });
  }

  async resetOrder() {
    this.order.products = [];
    await this.saveOrder();
  }

  async clearOrder() {
    this.order = new Order();
    await this.resetOrder();
  }

  getProducts() {
    return this.order.products;
  }

  async addProduct(product: Product) {
    const productFound = this.searchProduct(product);
    if (productFound) {
      productFound.quantity++;
    } else {
      this.order.products.push({
        product,
        quantity: 1
      });
    }
    await this.saveOrder();
  }

  private searchProduct(product: Product) {
    return this.order.products.find(
      (p: ProductQuantity) => isEqual(p.product, product)
    );
  }

}
