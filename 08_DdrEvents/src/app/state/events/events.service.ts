import { Injectable, inject } from '@angular/core';
import { Database, get, orderByChild, push, query, ref, remove, set, startAt } from '@angular/fire/database';
import * as moment from 'moment';
import DDREvent from 'src/app/models/ddr-event';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private database: Database;

  constructor() {
    this.database = inject(Database);
  }

  createEvent(event: DDREvent) {
    return new Promise((resolve, reject) => {
      try {
        let eventRef = ref(this.database, 'eventos');
        const newRef = push(eventRef);
        event.id = newRef.key as string;
        set(newRef, {...event});
        resolve(true)
      } catch (error) {
        console.error(error); // dbg
        reject(false);
      }
    });
  }

  updateEvent(event: DDREvent) {
    return new Promise((resolve, reject) => {
      try {
        let eventRef = ref(this.database, 'eventos/' + event.id);
        set(eventRef, {...event});
        resolve(true)
      } catch (error) {
        reject(false);
      }
    });
  }

  deleteEvent(eventId: string) {
    return new Promise((resolve, reject) => {
      try {
        let eventRef = ref(this.database, 'eventos/' + eventId);
        remove(eventRef);
        resolve(true)
      } catch (error) {
        reject(false);
      }
    });
  }

  getFutureEvents() {
    /*
    NOTA: Hay varias formas de implementación, entre ellas el método
    basado en promesa y el basado en observable. El instructor recomienda
    usar el de promesa, ya que el observable da muchos fallos.
    */
    const queryDB = query(
      ref(this.database, 'eventos'),
      orderByChild('dateStart'),
      startAt(moment().format('YYYY-MM-DDTHH:mm'))
    );
    return get(queryDB);
  }
}
