import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';

import { Tab3PageRoutingModule } from './tab3-routing.module';
import { PaymentListComponent } from './components/payment-list/payment-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { DataListComponent } from 'src/app/shared/data-list/data-list.component';
import { FilterComponent } from "../../../shared/filter/filter.component";

@NgModule({
    declarations: [Tab3Page, PaymentListComponent],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        Tab3PageRoutingModule,
        TranslateModule.forChild(),
        DataListComponent,
        FilterComponent
    ]
})
export class Tab3PageModule {}
