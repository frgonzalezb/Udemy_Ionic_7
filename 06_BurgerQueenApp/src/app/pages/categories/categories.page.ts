import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import Category from 'src/app/models/category';
import { GetCategories } from 'src/app/state/categories/categories.actions';
import { CategoriesState } from 'src/app/state/categories/categories.state';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  public categories: Category[];

  constructor(
    private store: Store,
    private loadingController: LoadingController,
    private navController: NavController,
    private navParams: NavParams,
    private _translate: TranslateService
  ) {
    this.categories = [];
  }

  ngOnInit() {
    this.loadData();
  }

  async showLoading() {
    const loading = await this.loadingController.create({
      message: this._translate.instant('label.loading'),
      duration: 3000,
    });

    loading.present();

    return loading;
  }

  async loadData() {
    const loading = await this.showLoading();

    try {
      this.store.dispatch(new GetCategories()).subscribe({
        next: () => {
          this.categories = this.store.selectSnapshot(
            CategoriesState.categories
          );
          console.log(this.categories); // dbg
        }
      });
    } catch (error) {
      console.error(error); // dbg
    } finally {
      loading.dismiss();
    }
  }

  goToProducts(category: Category) {
    this.navParams.data['idCategory'] = category._id;
    this.navController.navigateForward('product-list');
  }

}
