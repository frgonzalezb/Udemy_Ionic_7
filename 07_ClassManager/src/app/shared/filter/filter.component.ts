import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() filterData: EventEmitter<Filter>;

  public showFilter: boolean;

  constructor(
    private popoverCtrl: PopoverController
  ) {
    this.showFilter = false;
    this.filterData = new EventEmitter<Filter>();
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
      cssClass: 'custom-popover-content',
      componentProps: {
        filter: this.filter
      }
    });
    /*
    1.
    Nótese que el parámetro "event" permite que el popover sea ubicado
    cercanamente a la posición del elemento que lo llama (en este caso,
    el botón). En caso de no estar "event" en el objeto popover, el
    popover se colocará en el centro como posición por defecto. Por lo
    que "event" es opcional realmente, pero se utiliza aquí para mostrar
    su uso (y para seguir el ejemplo del curso). :P

    2.
    En caso de usar "cssClass", conviene definir la clase de CSS en
    global.scss
    */

    popover.onDidDismiss().then((event) => {
      console.log(event.data); // dbg
      
      this.showFilter = false;
      this.filterData.emit(event.data);
    });

    return await popover.present();
  }

}
