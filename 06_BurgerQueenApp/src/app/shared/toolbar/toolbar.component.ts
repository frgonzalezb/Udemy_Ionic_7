import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EventType, Router } from '@angular/router';
import { IonicModule, MenuController, NavController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { UserOrderService } from 'src/app/services/user-order.service';
import { LoginComponent } from '../login/login.component';
import { KEY_TOKEN } from 'src/app/constants/constants';
import { Preferences } from '@capacitor/preferences';
import { ToastService } from 'src/app/services/toast.service';
import { CreateAccountComponent } from '../create-account/create-account.component';
import { ProductOrderListComponent } from '../product-order-list/product-order-list.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    LoginComponent,
    CreateAccountComponent,
    ProductOrderListComponent
  ]
})
export class ToolbarComponent implements OnInit {

  public showBack: boolean;
  public showUserInfo: boolean;
  public showCreateAccount: boolean;
  public showOrder: boolean;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private _toast: ToastService,
    private _translate: TranslateService,
    public _userOrder: UserOrderService
  ) {
    this.showBack = false;
    this.showUserInfo = false;
    this.showCreateAccount = false;
    this.showOrder = false;
  }

  ngOnInit() {
    this.router.events.pipe(
      filter((event) => event.type === EventType.RoutesRecognized)
    ).subscribe({
      next: (event: any) => {
        this.showBack = event.state.root.firstChild?.data['showBack'];
      }
    });
  }

  goBack() {
    this.navCtrl.back();
  }

  async logout() {
    await this._userOrder.clearOrder();
    await Preferences.remove({ key: KEY_TOKEN });
    this.navCtrl.navigateForward('categories');
    this.menuCtrl.close('content');
    this._toast.showToast(
      this._translate.instant('label.logout.success')
    );
  }

  showUserInfoPanel() {
    this.showUserInfo = true;
  }

  back() {
    this.showUserInfo = false;
    this.showCreateAccount = false;
    this.showOrder = false;
  }

  createNewAccount() {
    this.showCreateAccount = true;
  }

  showLogin() {
    this.showCreateAccount = false;
  }

  goToPay() {
    this.back();
    this.menuCtrl.close('content');
    this.navCtrl.navigateForward('payment');
  }

  seeOrder() {
    this.showOrder = true;
  }

}
