import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShoppingItemsService {

  public items: string[];
  public isEmpty: boolean;

  constructor() {
    this.items = [];
    this.isEmpty = true;
  }

  addItem(item: string) {
    this.items.push(item);
    this.isEmpty = false;
  }

  removeItem(item: string) {
    let index = this.items.findIndex(it => it === item);

    if (index = -1) {
      this.items.splice(index, 1);
      if (this.items.length == 0) {
        this.isEmpty = true;
      }
    }
  }

  removeAllItems() {
    this.items = [];
    this.isEmpty = true;
  }

  searchItem(item: string) {
    const itemFound = this.items.find(
      it => it.toUpperCase().trim() === item.toUpperCase().trim()
    );
    return itemFound;
  }

}
