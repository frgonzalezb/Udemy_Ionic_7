import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, PopoverController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import Filter from 'src/app/models/filter';
import Student from 'src/app/models/student';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';

@Component({
  selector: 'app-content-filter',
  templateUrl: './content-filter.component.html',
  styleUrls: ['./content-filter.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule],
})
export class ContentFilterComponent implements OnInit {

  @Input() filter!: Filter;

  public students: Student[];

  constructor(
    private _sqlite: SqliteManagerService,
    private popoverCtrl: PopoverController
  ) {
    this.students = [];
  }

  ngOnInit() {
    this._sqlite.getStudents().then(students => {
      if (students) {
        this.students = students;
      }
    });
  }

  filterData() {
    this.popoverCtrl.dismiss(this.filter);
  }

  resetFilter() {
    this.filter = new Filter();
    this.popoverCtrl.dismiss(this.filter);
  }

}
