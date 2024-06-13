import { Component, OnInit } from '@angular/core';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';
import Student from 'src/app/models/student';

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
    this.getStudents();
  }

  onShowForm() {
    this.showForm = true;
  }

  getStudents() {
    this._sqlite.getStudents().then((students) => {
      if (!students) {
        return null;
      }
      this.students = students;
      console.log(this.students); // dbg
      return students;
    });
  }

}
