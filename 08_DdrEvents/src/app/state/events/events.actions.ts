import DDREvent from "src/app/models/ddr-event";

export class CreateEvent {
  static readonly type = '[Events] Create event';
  constructor(public payload: { event: DDREvent }) { }
}

export class UpdateEvent {
  static readonly type = '[Events] Update event';
  constructor(public payload: { event: DDREvent }) { }
}

export class DeleteEvent {
  static readonly type = '[Events] Delete event';
  constructor(public payload: { id: string }) { }
}

export class GetFutureEvents {
  static readonly type = '[Events] Get future events';
}
