import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { CreateEvent } from './events.actions';
import DDREvent from 'src/app/models/ddr-event';
import { EventsService } from './events.service';

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
}
