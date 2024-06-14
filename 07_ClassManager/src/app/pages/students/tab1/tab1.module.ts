import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { StudentListComponent } from './components/student-list/student-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { DataListComponent } from 'src/app/shared/data-list/data-list.component';
import { StudentFormComponent } from './components/student-form/student-form.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    TranslateModule.forChild(),
    DataListComponent
  ],
  declarations: [
    Tab1Page,
    StudentListComponent,
    StudentFormComponent
  ]
})
export class Tab1PageModule {}
