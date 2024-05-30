import { Component } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { GetProductById } from 'src/app/state/products/products.actions';
import { ProductsState } from 'src/app/state/products/products.state';
import Product from 'src/app/models/product';
import ProductExtraOption from 'src/app/models/product-extra-option';
import { UserOrderService } from 'src/app/services/user-order.service';
import { ToastService } from 'src/app/services/toast.service';
import { TranslateService } from '@ngx-translate/core';

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
      private store: Store,
      private _userOrder: UserOrderService,
      private _toast: ToastService,
      private _translate: TranslateService
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
    if (!this.product) {
      console.error('Product is of null-type!'); // dbg
      return;
    }
    const price = this._userOrder.getProductPrice(this.product);
    if (price === undefined) {
      this.total = 0;
    } else {
      this.total = price
    }
  }

  changeMultipleOption($event: any, options: ProductExtraOption[]) {
    options.forEach(op => op.activate = $event.detail.value == op.name);
    this.calculateTotal();
  }

  getProduct($event: any) {
    if (!this.product) {
      console.error('Product is undefined!'); // dbg
      return
    }
    if (!this.product._id) {
      console.error('Product ID is undefined!'); // dbg
      return
    }

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
  }

  addProductOrder() {
    if (!this.product) {
      console.error('Product is of null-type!'); // dbg
      return;
    }
    console.log(this._userOrder.getProducts()); // dbg
    
    this._userOrder.addProduct(this.product);
    this._toast.showToast(
      this._translate.instant('label.product.add.success')
    );

    this.navController.navigateRoot('categories');
  }

}
