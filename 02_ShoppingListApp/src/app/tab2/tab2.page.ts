import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ShoppingItemsService } from '../services/shopping-items.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public item: string;

  constructor(
      private _shoppingList: ShoppingItemsService,
      private alertController: AlertController
      ) {
    this.item = '';
  }

  addItem() {
    if (!this._shoppingList.searchItem(this.item)) {
      this._shoppingList.addItem(this.item);
      this.alertSuccess(this.item);
      this.item = '';
    } else {
      this.alertError();
    }
    
  }

  async alertSuccess(item: string) {
    const alert = await this.alertController.create({
      header: '¡Muy bien!',
      message: `Ítem "${item}" añadido exitosamente`,
      buttons: ['OK']
    });

    await alert.present();
  }

  async alertError() {
    const alert = await this.alertController.create({
      header: '¡Error!',
      message: 'El ítem ya existe',
      buttons: ['OK']
    });

    await alert.present();
  }

}
