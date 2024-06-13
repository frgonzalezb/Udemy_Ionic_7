import { Component, OnInit } from '@angular/core';
import Student from 'src/app/models/student';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss'],
})
export class StudentListComponent implements OnInit {

  public students: Student[];
  public showForm: boolean;

  constructor(
    private _sqlite: SqliteManagerService
  ) {
    this.students = [];
    this.showForm = false;
  }

  ngOnInit() {
    this.students = [];
    this.showForm = false;
  }

  onShowForm() {
    this.showForm = true;
  }

}
