import DDREvent from "src/app/models/ddr-event";

export class CreateEvent {
  static readonly type = '[Events] Create event';
  constructor(public payload: { event: DDREvent }) { }
}
