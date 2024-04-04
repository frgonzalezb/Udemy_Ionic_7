import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import Product from 'src/app/models/product';
import { GetProductsByCategory } from 'src/app/state/products/products.actions';
import { ProductsState } from 'src/app/state/products/products.state';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {

  public products: Product[];
  private idCategory: string;

  constructor(
    private navParams: NavParams,
    private navController: NavController,
    private store: Store,
    private loadingController: LoadingController,
    private _translate: TranslateService
  ) {
    this.idCategory = this.navParams.data['idCategory'];
    console.log(this.idCategory); // dbg
    this.products = [];
  }

  async ngOnInit() {
    if (this.idCategory) {

      const loading = await this.loadingController.create({
        message: this._translate.instant('label.loading'),
      });

      await loading.present();

      this.store.dispatch(new GetProductsByCategory({
        idCategory: this.idCategory
      })).subscribe({
        next: () => {
          this.products = this.store.selectSnapshot(
            ProductsState.products
          );
          console.log(this.products); // dbg
        },
        error: (e) => {
          console.error(e); // dbg
        },
        complete: () => {
          loading.dismiss();
        }
      });
    } else {
      this.navController.navigateForward('categories');
    }
  }

  gotToProduct(product: Product) {
    this.navParams.data['product'] = product;
    this.navController.navigateForward('product');
  }

}
