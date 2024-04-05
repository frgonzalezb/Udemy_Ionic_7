import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import Product from 'src/app/models/product';
import ProductExtraOption from 'src/app/models/product-extra-option';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  public product: Product;

  constructor(
      private navController: NavController,
      private navParams: NavParams
      ) {
    this.product = this.navParams.data['product'];
    console.log(this.product); // dbg
  }

  ngOnInit() {
    if (!this.product) {
      this.navController.navigateForward('categories');
    }
  }

  changeMultipleOption($event: any, options: ProductExtraOption[]) {
    console.log($event); // dbg
    
    options.forEach(op => op.activate = $event.detail.value == op.name);

    console.log(options); // dbg
    console.log(this.product); // dbg
    
  }

}
