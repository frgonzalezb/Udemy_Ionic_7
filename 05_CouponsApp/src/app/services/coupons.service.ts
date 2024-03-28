import { Injectable } from '@angular/core';
import Coupon from '../models/coupon';

@Injectable({
  providedIn: 'root'
})
export class CouponsService {

  constructor() { }

  getCoupons() {
    /* Retrieves all the available coupons from a JSON file. */
    return fetch('./assets/data/data.json').then(async response => {
      const coupons: Coupon[] = await response.json() as Coupon[];
      coupons.forEach(c => c.active = false);
      return Promise.resolve(coupons);
    }).catch(error => {
      console.error(error); // dbg
      return Promise.reject([]);
    });
  }
}
