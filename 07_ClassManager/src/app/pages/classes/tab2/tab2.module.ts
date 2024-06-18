import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { ClassListComponent } from './components/class-list/class-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { DataListComponent } from 'src/app/shared/data-list/data-list.component';
import { ClassFormComponent } from './components/class-form/class-form.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab2PageRoutingModule,
    TranslateModule.forChild(),
    DataListComponent,
  ],
  declarations: [
    Tab2Page,
    ClassListComponent,
    ClassFormComponent
  ]
})
export class Tab2PageModule {}
