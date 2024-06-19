import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ContentFilterComponent } from './content-filter/content-filter.component';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    ContentFilterComponent
  ],
})
export class FilterComponent implements OnInit {

  constructor(
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
    this.createPopover(null);
  }

  async createPopover(event: any) {
    const popover = await this.popoverCtrl.create({
      component: ContentFilterComponent,
      backdropDismiss: true,
      event,
      componentProps: {}
    });

    popover.onDidDismiss().then((event) => {
      
    });

    return await popover.present();
  }

}
