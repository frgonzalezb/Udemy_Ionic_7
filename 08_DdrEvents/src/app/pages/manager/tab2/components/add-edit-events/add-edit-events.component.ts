import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import DDREvent from 'src/app/models/ddr-event';

@Component({
  selector: 'app-add-edit-events',
  templateUrl: './add-edit-events.component.html',
  styleUrls: ['./add-edit-events.component.scss'],
})
export class AddEditEventsComponent implements OnInit {

  public showEnd: boolean;
  public edit: boolean;
  public eventForm!: FormGroup;
  public event!: DDREvent;

  constructor(
    private fb: FormBuilder
  ) {
    this.edit = false;
    this.showEnd = false;
  }

  ngOnInit() {
    this.initEvent();
  }

  initEvent() {
    if (!this.event) {
      this.edit = false;
      this.showEnd = false;
      this.event = new DDREvent();
    } else {
      this.edit = true;
      this.showEnd = (this.event.dateEnd) != null;
    }
    this.eventForm = this.fb.group({
      title: new FormControl(this.event.title, [
        Validators.required
      ]),
      start: new FormControl(this.event.dateStart ? this.event.dateStart : moment().format('YYYY-MM-DDTHH:mm')),
      end: new FormControl(this.event.dateEnd ? this.event.dateEnd : moment().format('YYYY-MM-DDTHH:mm')),
      type: new FormControl(this.event.type ? this.event.type : 'blog', [
        Validators.required
      ]),
      url: new FormControl(this.event.url, [
        Validators.required,
        Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')
      ]),
      description: new FormControl(this.event.description, [
        Validators.required,
      ])
    });
  }

  addOrEditEvent() {
    console.log(this.eventForm.value); // dbg
    
  }

  newEvent() {
    this.edit = false;
    this.showEnd = false;
    this.event = new DDREvent();
    this.eventForm.patchValue({
      title: '',
      start: moment().format('YYYY-MM-DDTHH:mm'),
      end: moment().format('YYYY-MM-DDTHH:mm'),
      type: 'blog',
      url: '',
      description: ''
    });
  }

  changeShowEnd() {
    this.showEnd = !this.showEnd;
    if (this.showEnd) {
      this.eventForm.patchValue({ end: moment().format('YYYY-MM-DDTHH:mm') });
    } else {
      this.eventForm.patchValue({ end: null });
    }
  }

}
