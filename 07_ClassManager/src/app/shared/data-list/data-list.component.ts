import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, TranslateModule],
  providers: [TranslateService],
})
export class DataListComponent {

  @Input({ required: true }) data!: any[];
  @Input() emptyText!: string;
  @Input() addText!: string;
  @Input() showAdd: boolean = true;

  @Output() add: EventEmitter<boolean>;

  @ContentChild('templateData', { static: false }) templateData!: TemplateRef<any>;

  constructor() {
    this.add = new EventEmitter<boolean>();
  }

  addData() {
    this.add.emit(true);
  }

}
