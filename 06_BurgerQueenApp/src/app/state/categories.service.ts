import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import Category from '../models/category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor() {}

  getCategories(): Promise<Category[]> {
    return CapacitorHttp.get({
      url: environment.urlApi + 'categories',
      params: {},
      headers: {
        'Content-type': 'application/json'
      }
    }).then((response: HttpResponse) => {
      if (response.status == 200) {
        const data = response.data as Category[];
        return data
      }
      return [];
    }).catch(error => {
      console.error(error);
      return []; // Return empty array in case of error
    }) as Promise<Category[]>; // Type assertion to ensure consistent return type
  }
}
