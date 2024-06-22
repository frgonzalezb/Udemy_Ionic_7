import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';

import { Tab3PageRoutingModule } from './tab3-routing.module';
import { PaymentListComponent } from './components/payment-list/payment-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { DataListComponent } from 'src/app/shared/data-list/data-list.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab3PageRoutingModule,
    TranslateModule.forChild(),
    DataListComponent
  ],
  declarations: [Tab3Page, PaymentListComponent]
})
export class Tab3PageModule {}
