import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
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
  private subscription!: Subscription;

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
    this.subscription = new Subscription();
    this.loadData();
  }

  async loadData() {
    const loading = await this.loadingController.create({
      message: this._translate.instant('label.loading'),
      duration: 3000,
    });

    await loading.present();

    this.store.dispatch(new GetCategories());

    const sub = this.categories$.subscribe({
      next: () => {
        this.categories = this.store.selectSnapshot(CategoriesState.categories);
        console.log(this.categories); // dbg
        loading.dismiss();
      }, error: (error) => {
        console.error(error); // dbg
        loading.dismiss();
      }
    });
    this.subscription.add(sub);
  }

  goToProducts(category: Category) {
    this.navParams.data['idCategory'] = category._id;
    this.navController.navigateForward('product-list');
  }

  refreshCategories($event: any) {
    this.store.dispatch(new GetCategories());
    $event.target.complete();
  }

  ionViewWillLeave() {
    /* Unsubscribes all subs when leaving the page. */;
    this.subscription.unsubscribe();
    console.log('Subscriptions for categories have been terminated!');
  }

}
