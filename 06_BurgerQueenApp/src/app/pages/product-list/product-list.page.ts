import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { GetProductsByCategory } from 'src/app/state/products/products.actions';
import { ProductsState } from 'src/app/state/products/products.state';
import { Observable, Subscription } from 'rxjs';
import Product from 'src/app/models/product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage {

  @Select(ProductsState.products)
  private products$!: Observable<Product[]>;

  public products: Product[];
  private idCategory: string = '';

  private subscription!: Subscription;

  constructor(
    private navParams: NavParams,
    private navController: NavController,
    private store: Store,
    private loadingController: LoadingController,
    private _translate: TranslateService
  ) {
    this.products = [];
  }

  async ionViewWillEnter() {
    this.subscription = new Subscription();
    this.idCategory = this.navParams.data['idCategory'];
    console.log(this.idCategory); // dbg

    if (this.idCategory) {

      const loading = await this.loadingController.create({
        message: this._translate.instant('label.loading'),
      });

      await loading.present();

      this.store.dispatch(new GetProductsByCategory({
        idCategory: this.idCategory
      }));

      const sub = this.products$.subscribe({
        next: () => {
          this.products = this.store.selectSnapshot(
            ProductsState.products
          );
          console.log(this.products); // dbg
          loading.dismiss();
        },
        error: (e) => {
          console.error(e); // dbg
          loading.dismiss();
        }
      });
      this.subscription.add(sub);
    } else {
      this.navController.navigateForward('categories');
    }
  }

  gotToProduct(product: Product) {
    if (product) {
      this.navParams.data['product'] = product;
      this.navController.navigateForward('product');
    } else {
      console.error('Product is undefined');
    }
  }

  refreshProducts($event: any) {
    this.store.dispatch(new GetProductsByCategory({
      idCategory: this.idCategory
    }));
    $event.target.complete();
  }

  ionViewWillLeave() {
    /* Unsubscribes all subs when leaving the page. */;
    this.subscription.unsubscribe();
    console.log('Subscriptions for product-list have been terminated!');
  }

}
