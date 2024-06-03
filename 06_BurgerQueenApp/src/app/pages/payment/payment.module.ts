import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentPageRoutingModule } from './payment-routing.module';

import { PaymentPage } from './payment.page';
import { TranslateModule } from '@ngx-translate/core';
import { LoginComponent } from 'src/app/shared/login/login.component';
import { CreateAccountComponent } from 'src/app/shared/create-account/create-account.component';
import { ProductOrderListComponent } from 'src/app/shared/product-order-list/product-order-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentPageRoutingModule,
    TranslateModule.forChild(),
    LoginComponent,
    CreateAccountComponent,
    ProductOrderListComponent
  ],
  declarations: [PaymentPage]
})
export class PaymentPageModule {}
