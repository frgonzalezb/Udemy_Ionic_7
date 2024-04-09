import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import Product from 'src/app/models/product';

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
      return [];              // Return empty array in case of error
    }) as Promise<Product[]>; // Type assertion to ensure consistent return type
  }

  getProductById(id: string) {
    return CapacitorHttp.get({
      url: environment.urlApi + 'products/' + id,
      params: {},
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response: HttpResponse) => {
      if (response.status == 200) {
        const data = response.data as Product;
        console.log(data); // dbg
        
        return data;
      }
      return [];
    }).catch(error => {
      console.error(error);
      return [];
    }) as Promise<Product>;
  }
}
