/*
NOTA:
El Select de ngxs (usado en el curso) da error por deprecación.
La documentación oficial deja el siguiente consejo para compensarlo:

class UsersComponent {
  @Select(UsersState.getUsers) users$!: Observable<User[]>;

  // Should become the following
  users$: Observable<User[]> = inject(Store).select(UsersState.getUsers);
}

Ref: https://www.ngxs.io/deprecations/select-decorator-deprecation
*/

import { Component, OnInit, inject } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { ActionSheetController, NavController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import DDREvent from 'src/app/models/ddr-event';
import { AlertService } from 'src/app/services/alert.service';
import { AuthState } from 'src/app/state/auth/auth.state';
import { GetFutureEvents } from 'src/app/state/events/events.actions';
import { EventsState } from 'src/app/state/events/events.state';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent  implements OnInit {
  
  events$: Observable<DDREvent[]> = inject(Store).select(EventsState.events);

  public events: DDREvent[];
  public eventSelected!: DDREvent;

  constructor(
    private store: Store,
    private navParams: NavParams,
    private navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private _alert: AlertService,
    private _translate: TranslateService
  ) {
    this.events = [];
  }

  ngOnInit() {
    this.store.dispatch(new GetFutureEvents());
    this.fetchEvents();
  }

  fetchEvents() {
    this.events$.subscribe({
      next: () => {
        const events = this.store.selectSnapshot(EventsState.events);
        this.events = events;
        console.log(this.events); // dbg
      }
    });
  }

  clickEvent(event: DDREvent) {
    this.eventSelected = event;
    const isLoggedIn = this.store.selectSnapshot(AuthState.isLoggedIn);
    if (isLoggedIn) {
      this.presentActions();
    } else {
      this.openUrl(this.eventSelected.url);
    }
  }

  async presentActions() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this._translate.instant('label.actions.event'),
      buttons: [
        {
          text: this._translate.instant('label.open.url'),
          icon: 'earth-outline',
          handler: () => {
            this.openUrl(this.eventSelected.url);
          }
        },
        {
          text: this._translate.instant('label.edit.event'),
          icon: 'pencil-outline',
          handler: () => {
            this.passEvent();
          }
        },
        {
          text: this._translate.instant('label.remove.event'),
          icon: 'trash-outline',
          handler: () => {
            console.log('Remove event clicked!'); // dbg
            this.confirmRemoveEvent();
          }
        },
        {
          text: this._translate.instant('label.close.options'),
          icon: 'close-outline',
          role: 'cancel'
        },
      ]
    });

    await actionSheet.present();
  }

  async openUrl(url: string) {
    if (url) {
      await Browser.open({ url });
    }
  }

  passEvent() {
    this.navParams.data['event'] = this.eventSelected;
    this.navCtrl.navigateForward('/tabs/tab2', this.navParams.data);
  }

  confirmRemoveEvent() {
    const self = this;
    this._alert.alertConfirm(
      this._translate.instant('label.confirm'),
      this._translate.instant('label.remove.event.message'),
      function () {
        console.log('Remove event clicked!'); // dbg
        self.removeEvent();
      }
    );
  }

  removeEvent() {
    // TODO
  }

}
