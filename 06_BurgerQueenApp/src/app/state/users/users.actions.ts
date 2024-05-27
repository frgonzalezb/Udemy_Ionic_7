export class GetUser {
  static readonly type = '[Users] Get user';
  constructor(public payload: { email: string }) { }
}
