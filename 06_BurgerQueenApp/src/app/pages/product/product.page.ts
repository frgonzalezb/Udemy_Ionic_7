import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { Store } from '@ngxs/store';
import Product from 'src/app/models/product';
import ProductExtraOption from 'src/app/models/product-extra-option';
import { GetProductById } from 'src/app/state/products/products.actions';
import { ProductsState } from 'src/app/state/products/products.state';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage {

  public product!: Product | null;
  public total: number = 0;

  constructor(
      private navController: NavController,
      private navParams: NavParams,
      private store: Store
      ) {
  }

  ionViewWillEnter() {
    this.product = this.navParams.data['product'];
    console.log(this.product); // dbg
    
    if (this.product && this.product.extras) {
      this.total = this.product.price;
    }

    if (!this.product) {
      this.navController.navigateForward('categories');
    }
  }

  calculateTotal() {
    let total = this.product?.price || 0;
    console.log('calculateTotal', total); // dbg
    

    this.product?.extras?.forEach(extra => {
      extra.blocks?.forEach(block => {
        if (block.options.length == 1 && block.options[0].activate) {
          total += block.options[0].price;
        } else if (block.options.length > 1) {
          const option = block.options.find(op => op.activate);
          if (option) {
            total += option?.price;
          }
          
        }
      });
    });
    this.total = +total.toFixed(2);
  }

  changeMultipleOption($event: any, options: ProductExtraOption[]) {
    options.forEach(op => op.activate = $event.detail.value == op.name);
    this.calculateTotal();
  }

  getProduct($event: any) {
    if (this.product && this.product._id) { // Check if this.product and this.product._id are defined
      this.store.dispatch(new GetProductById({ id: this.product._id }))
        .subscribe({
          next: () => {
            this.product = this.store.selectSnapshot(ProductsState.product);
            this.calculateTotal();
          },
          complete: () => {
            $event.target.complete();
          }
        });
    } else {
      console.error('Product or product ID is undefined');
      $event.target.complete(); // Complete the event to prevent potential infinite loading
    }
  }

}
