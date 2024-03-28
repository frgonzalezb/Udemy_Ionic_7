import { Component } from '@angular/core';
import { ShoppingItemsService } from '../services/shopping-items.service';
import { AlertController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
      public _shoppingList: ShoppingItemsService,
      private alertController: AlertController,
      private menuController: MenuController
  ) {}

  async removeItem(item: string) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: `¿Deseas eliminar el ítem "${item}"?\nEsta acción es irreversible`,
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            this._shoppingList.removeItem(item);
          }
        },
        {
          text: 'No',
          handler: () => {
            alert.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }

  async removeAll() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: `¿Deseas eliminar todos los ítems? Esta acción es irreversible`,
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            this._shoppingList.removeAllItems();
            this.menuController.close();
          }
        },
        {
          text: 'No',
          handler: () => {
            alert.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }

  onRenderItems($event: any) {
    console.log($event); // dbg

    // Para evitar el "pegado" de items, hacer lo siguiente
    const item = this._shoppingList.items.splice($event.detail.from, 1)[0];
    this._shoppingList.items.splice($event.detail.to, 0, item);

    $event.detail.complete();
    console.log(this._shoppingList.items); // dbg
    
  }

}
