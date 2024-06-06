import { Injectable } from '@angular/core';
import Order from '../models/order';
import { Preferences } from '@capacitor/preferences';
import { KEY_ORDER } from '../constants/constants';
import Product from '../models/product';
import ProductQuantity from '../models/product-quantity';
import { isEqual, remove } from 'lodash-es';
import User from '../models/user';

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

  async increaseProductQuantity(product: Product) {
    /* Increases some product quantity in the order cart by 1. */
    const productFound = this.searchProduct(product);
    if (productFound) {
      productFound.quantity++;
    }
    await this.saveOrder();
  }

  async decreaseProductQuantity(product: Product) {
    /* Reduces some product quantity in the order cart by 1. */
    const productFound = this.searchProduct(product);
    if (productFound) {
      productFound.quantity--;
      if (productFound.quantity === 0) {
        this.removeProduct(product);
      }
    }
    await this.saveOrder();
  }

  async removeProduct(product: Product) {
    /* Removes a product from the order cart. */
    remove(this.order.products, p => isEqual(p.product, product));
    await this.saveOrder();
  }

  getProductPrice(product: Product) {
    if (!product) {
      console.error('Product is null!'); // dbg
      return;
    }
    if (!product.price) {
      console.error('This product has no price!'); // dbg
      return;
    }

    let total = product.price;
    console.log('calculateTotal', total); // dbg

    if (product.extras) {
      product?.extras?.forEach(extra => {
        extra.blocks?.forEach(block => {
          if (block.options.length == 1 && block.options[0].activate) {
            total += block.options[0].price;
          } else if (block.options.length > 1) {
            const option = block.options.find(op => op.activate);
            if (option) {
              total += option?.price;
            }
            
          }
        });
      });
    }
    return +total.toFixed(2);
  }

  getTotalPrice(ProductQuantity: ProductQuantity) {
    const productPrice = this.getProductPrice(ProductQuantity.product);
    if (productPrice === undefined) {
      return 0;
    }
    const total = productPrice * ProductQuantity.quantity;
    return +total.toFixed(2);
  }

  getTotalOrder() {
    let total = 0;
    for (let productQuantity of this.order.products) {
      total += this.getTotalPrice(productQuantity);
    }
    return total;
  }

  private searchProduct(product: Product) {
    return this.order.products.find(
      (p: ProductQuantity) => isEqual(p.product, product)
    );
  }

  hasUser() {
    return this.order && this.order.user;
  }

  getUser() {
    return this.order.user
  }

  async saveUser(user: User) {
    // using type casting to overcome delete optional field from object
    const userWithoutPassword = { ...user };
    delete (userWithoutPassword as { password?: string }).password;
    this.order.user = user;
    await this.saveOrder();
  }

  countProducts() {
    if (this.order && this.order.products.length > 0) {
      return this.order.products.reduce(
        (acumulator: number, value: ProductQuantity) => value.quantity + acumulator, 0
      );
    }
    return 0;
  }

  getOrder() {
    return this.order;
  }

}
