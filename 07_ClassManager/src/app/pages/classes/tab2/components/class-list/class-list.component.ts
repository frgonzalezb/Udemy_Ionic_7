import { Component, OnInit } from '@angular/core';
import Class from 'src/app/models/class';
import Student from 'src/app/models/student';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.scss'],
})
export class ClassListComponent implements OnInit {

  public classes: Class[];
  public classSelected: Class | null;
  public showForm: boolean;

  constructor(
    private _sqlite: SqliteManagerService
  ) {
    this.classes = [];
    this.classSelected = null;
    this.showForm = false;
  }

  ngOnInit() {
    this.getClasses();
  }

  onShowForm() {
    this.showForm = true;
  }

  onCloseForm() {
    this.showForm = false;
    this.getClasses();
  }

  getClasses() {
    Promise.all([
      this._sqlite.getClasses(),
      this._sqlite.getStudents()
    ]).then(results => {
      if (results[0] && results[1]) {
        this.classes = results[0];
        let students = results[1];
        this.associateStudentsToClasses(students);
      }
    });
  }

  private associateStudentsToClasses(students: Student[]) {
    this.classes.forEach(c => {
      let student = students.find(s => s.id === c.id_student);
      if (student) {
        c.student = student;
      }
    })
  }

}
