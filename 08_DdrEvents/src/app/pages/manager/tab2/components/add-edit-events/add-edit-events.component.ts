import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import DDREvent from 'src/app/models/ddr-event';
import { AlertService } from 'src/app/services/alert.service';

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
  public minDate!: string;

  constructor(
    private fb: FormBuilder,
    private _alert: AlertService,
    private _translate: TranslateService
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

    this.minDate = moment().format('YYYY-MM-DDTHH:mm');

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

    if (this.eventForm.valid) {

    } else {
      // Crear lista de errores de validación
      let errors = '<ul>';
      const fieldsToValidate = ['title', 'url', 'description'];

      for (let index = 0; index < fieldsToValidate.length; index++) {
        let field = fieldsToValidate[index];
        let fieldFromForm = this.eventForm.get(field);
        if (fieldFromForm && fieldFromForm.errors && fieldFromForm.errors['required']) {
          errors += '<li>' + this._translate.instant('label.error.' + field) + '</li>';
        }
        if (field === 'url' && fieldFromForm && fieldFromForm.errors && fieldFromForm.errors['pattern']) {
          errors += '<li>' + this._translate.instant('label.error.url.pattern') + '</li>';
        }
      }

      // PARA MI YO DEL FUTURO: Esto de abajo es el estilo del instructor, pero me pareció mejor
      // hacer lo de arriba, más conciso y abstracto.

      // let title = this.eventForm.get('title');
      // if (title && title.errors && title.errors['required']) {
      //   errors += '<li>' + this._translate.instant('label.error.title') + '</li>';
      // }

      // let description = this.eventForm.get('description');
      // if (description && description.errors && description.errors['required']) {
      //   errors += '<li>' + this._translate.instant('label.error.description') + '</li>';
      // }

      // let url = this.eventForm.get('url');
      // if (url && url.errors && url.errors['required']) {
      //   errors += '<li>' + this._translate.instant('label.error.url.required') + '</li>';
      // }

      // if (url && url.errors && url.errors['pattern']) {
      //   errors += '<li>' + this._translate.instant('label.error.url.pattern') + '</li>';
      // }
      
      errors += '</ul>';

      this._alert.alertSuccess(
        this._translate.instant('label.error'),
        errors
      );
    }
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
