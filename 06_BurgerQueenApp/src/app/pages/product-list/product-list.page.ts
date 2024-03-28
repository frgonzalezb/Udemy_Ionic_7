import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {

  private idCategory: string;

  constructor(
    private navParams: NavParams,
    private navController: NavController
  ) {
    this.idCategory = this.navParams.data['idCategory'];
    console.log(this.idCategory);
  }

  ngOnInit() {
    if (this.idCategory) {

    } else {
      this.navController.navigateForward('categories');
    }
  }

}
