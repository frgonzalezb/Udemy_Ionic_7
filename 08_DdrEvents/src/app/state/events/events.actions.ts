export class EventsAction {
  static readonly type = '[Events] Add item';
  constructor(public payload: string) { }
}
