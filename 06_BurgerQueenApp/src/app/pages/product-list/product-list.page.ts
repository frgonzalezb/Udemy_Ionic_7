import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
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
    private store: Store
  ) {
    this.idCategory = this.navParams.data['idCategory'];
    console.log(this.idCategory); // dbg
    this.products = [];
  }

  ngOnInit() {
    if (this.idCategory) {
      this.store.dispatch(new GetProductsByCategory({
        idCategory: this.idCategory
      })).subscribe({
        next: () => {
          this.products = this.store.selectSnapshot(
            ProductsState.products
          );
          console.log(this.products);
        }
      });
    } else {
      this.navController.navigateForward('categories');
    }
  }

}
