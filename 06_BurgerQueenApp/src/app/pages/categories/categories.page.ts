import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetCategories } from 'src/app/state/categories/categories.actions';
import { CategoriesState } from 'src/app/state/categories/categories.state';
import Category from 'src/app/models/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage {

  @Select(CategoriesState.categories)
  private categories$!: Observable<Category[]>;

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

  ionViewWillEnter() {
    this.loadData();
  }

  async loadData() {
    const loading = await this.loadingController.create({
      message: this._translate.instant('label.loading'),
      duration: 3000,
    });

    await loading.present();

    this.store.dispatch(new GetCategories());

    this.categories$.subscribe({
      next: () => {
        this.categories = this.store.selectSnapshot(CategoriesState.categories);
        console.log(this.categories); // dbg
        loading.dismiss();
      }, error: (error) => {
        console.error(error); // dbg
        loading.dismiss();
      }
    });
  }

  goToProducts(category: Category) {
    this.navParams.data['idCategory'] = category._id;
    this.navController.navigateForward('product-list');
  }

  refreshCategories($event: any) {
    this.store.dispatch(new GetCategories());
    $event.target.complete();
  }

}
