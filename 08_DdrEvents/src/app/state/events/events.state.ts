import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { EventsAction } from './events.actions';
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

  @Action(EventsAction)
  add({ getState, setState }: StateContext<EventsStateModel>, { payload }: EventsAction) {

  }
}
