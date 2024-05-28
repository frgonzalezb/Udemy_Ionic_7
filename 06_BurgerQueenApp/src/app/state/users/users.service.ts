import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { KEY_TOKEN } from 'src/app/constants/constants';
import User from 'src/app/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor() { }

  async getUser(email: string) {
    const token = await Preferences.get({ key: KEY_TOKEN });
    return CapacitorHttp.get({
      url: environment.urlApi + 'users/',
      params: {
        email
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token.value
      }
    }).then((response: HttpResponse) => {
      if (response.status == 200) {
        const data = response.data as User;
        return data;
      }
      return null;
    }).catch(error => {
      console.error(error);
      return null;
    });
  }

  async createUser(user: User) {
    return CapacitorHttp.post({
      url: environment.urlApi + 'users/',
      params: {},
      data: {
        ...user
      },
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((response: HttpResponse) => {
      if (response.status == 201) {
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
