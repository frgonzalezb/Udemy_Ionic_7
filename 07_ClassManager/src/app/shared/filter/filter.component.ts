import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ContentFilterComponent } from './content-filter/content-filter.component';
import Filter from 'src/app/models/filter';

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

  @Input() filter!: Filter;

  public showFilter: boolean;

  constructor(
    private popoverCtrl: PopoverController
  ) {
    this.showFilter = false;
  }

  ngOnInit() {
    this.createPopover(null);
  }

  showOrHideFilter($event: any) {
    this.showFilter = !this.showFilter;

    if (this.showFilter) {
      this.createPopover($event);
    } else {
      this.popoverCtrl.dismiss();
    }
  }

  async createPopover(event: any) {
    const popover = await this.popoverCtrl.create({
      component: ContentFilterComponent,
      backdropDismiss: true,
      event,
      componentProps: {
        filter: this.filter
      }
    });
    /*
    Nótese que el parámetro "event" permite que el popover sea ubicado
    cercanamente a la posición del elemento que lo llama (en este caso,
    el botón). En caso de no estar "event" en el objeto popover, el
    popover se colocará en el centro como posición por defecto. Por lo
    que "event" es opcional realmente, pero se utiliza aquí para mostrar
    su uso (y para seguir el ejemplo del curso). :P
    */

    popover.onDidDismiss().then((event) => {
      this.showFilter = false;
    });

    return await popover.present();
  }

}
