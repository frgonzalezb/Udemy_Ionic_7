import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import Category from 'src/app/models/category';
import Product from 'src/app/models/product';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor() { }

  getProductsByCategory(idCategory: string) {
    return CapacitorHttp.get({
      url: environment.urlApi + 'products/category/' + idCategory,
      params: {},
      headers: {
        'Content-type': 'application/json'
      }
    }).then((response: HttpResponse) => {
      if (response.status == 200) {
        const data = response.data as Product[];
        return data
      }
      return [];
    }).catch(error => {
      console.error(error);
      return [];               // Return empty array in case of error
    }) as Promise<Product[]>; // Type assertion to ensure consistent return type
  }
}
