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
import { ActionSheetController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import DDREvent from 'src/app/models/ddr-event';
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

  constructor(
    private store: Store,
    private actionSheetCtrl: ActionSheetController,
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

  clickEvent() {
    const isLoggedIn = this.store.selectSnapshot(AuthState.isLoggedIn);
    if (isLoggedIn) {
      this.presentActions();
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
            // TODO
            console.log('Open URL clicked!'); // dbg
          }
        },
        {
          text: this._translate.instant('label.edit.event'),
          icon: 'pencil-outline',
          handler: () => {
            // TODO
            console.log('Edit event clicked!'); // dbg
          }
        },
        {
          text: this._translate.instant('label.remove.event'),
          icon: 'trash-outline',
          handler: () => {
            // TODO
            console.log('Remove event clicked!'); // dbg
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

}
