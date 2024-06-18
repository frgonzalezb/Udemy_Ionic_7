import { Component, OnInit } from '@angular/core';
import Class from 'src/app/models/class';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.scss'],
})
export class ClassListComponent implements OnInit {

  public classes: Class[];
  public showForm: boolean;

  constructor(
    private _sqlite: SqliteManagerService
  ) {
    this.classes = [];
    this.showForm = false;
  }

  ngOnInit() {}

  onShowForm() {
    this.showForm = true;
  }

}
