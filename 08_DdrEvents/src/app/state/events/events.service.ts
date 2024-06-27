import { Injectable, inject } from '@angular/core';
import { Database, push, ref, set } from '@angular/fire/database';
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
        reject(false);
      }
    });
  }
}
