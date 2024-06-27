import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { CreateEvent, DeleteEvent, GetFutureEvents, UpdateEvent } from './events.actions';
import DDREvent from 'src/app/models/ddr-event';
import { EventsService } from './events.service';
import { DataSnapshot } from 'firebase/database';

export class EventsStateModel {
  public events!: DDREvent[];
  public success!: boolean;
}

const defaults = {
  events: [],
  success: false
};

@State<EventsStateModel>({
  name: 'events',
  defaults
})
@Injectable()
export class EventsState {

  @Selector()
  static events(state: EventsStateModel) {
    return state.events;
  }

  @Selector()
  static success(state: EventsStateModel) {
    return state.success;
  }

  constructor(private _events: EventsService) { }

  @Action(CreateEvent)
  async createEvent({ patchState }: StateContext<EventsStateModel>, { payload }: CreateEvent) {
    try {
      const success = await this._events.createEvent(payload.event);
      if (success) {
        patchState({
          success: true
        });
      }
    } catch (error) {
      patchState({
        success: false
      });
    }
  }

  @Action(UpdateEvent)
  async updateEvent({ patchState }: StateContext<EventsStateModel>, { payload }: UpdateEvent) {
    try {
      const success = await this._events.updateEvent(payload.event);
      if (success) {
        patchState({
          success: true
        });
      }
    } catch (error) {
      patchState({
        success: false
      });
    }
  }

  @Action(DeleteEvent)
  async deleteEvent({ patchState }: StateContext<EventsStateModel>, { payload }: DeleteEvent) {
    try {
      const success = await this._events.deleteEvent(payload.id);
      if (success) {
        patchState({
          success: true
        });
      }
    } catch (error) {
      patchState({
        success: false
      });
    }
  }

  @Action(GetFutureEvents)
  getFutureEvents({ patchState }: StateContext<EventsStateModel>) {
    return this._events.getFutureEvents().then((snapshot: DataSnapshot) => {
      const events: DDREvent[] = [];
      snapshot.forEach((childSnapshot: DataSnapshot) => {
        /*
        NOTA: Como nos vienen los eventos ordenados de forma ascendente,
        revertimos el orden y los añadimos al array de forma descendente.
        */
        const data = childSnapshot.val() as DDREvent;
        events.unshift(data);
      });
      patchState({
        events
      });
    });
  }
}
