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
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import DDREvent from 'src/app/models/ddr-event';
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

  constructor(private store: Store) {
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

}
