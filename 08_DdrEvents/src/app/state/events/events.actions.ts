import DDREvent from "src/app/models/ddr-event";

export class CreateEvent {
  static readonly type = '[Events] Create event';
  constructor(public payload: { event: DDREvent }) { }
}

export class UpdateEvent {
  static readonly type = '[Events] Update event';
  constructor(public payload: { event: DDREvent }) { }
}
