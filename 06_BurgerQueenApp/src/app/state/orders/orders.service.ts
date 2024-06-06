import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { KEY_TOKEN } from 'src/app/constants/constants';
import Order from 'src/app/models/order';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor() { }

  async createOrder(order: Order) {
    const token = await Preferences.get({ key: KEY_TOKEN });
    return CapacitorHttp.post({
      url: environment.urlApi + 'orders',
      params: {},
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token.value
      },
      data: {
        ...order
      }
    }).then((response: HttpResponse) => {
      if (response.status === 201) {
        const data = response.data as boolean;
        return data;
      }
      return false;
    }).catch(error => {
      console.error(error);
      return false;
    });
  }
}
