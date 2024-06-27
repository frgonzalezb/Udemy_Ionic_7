import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-edit-events',
  templateUrl: './add-edit-events.component.html',
  styleUrls: ['./add-edit-events.component.scss'],
})
export class AddEditEventsComponent implements OnInit {

  public showEnd: boolean;

  constructor() {
    this.showEnd = false;
  }

  ngOnInit() {}

  addOrEditEvent() {

  }

  changeShowEnd() {
    this.showEnd = !this.showEnd;
  }

}
