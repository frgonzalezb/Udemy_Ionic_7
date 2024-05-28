import User from "src/app/models/user";

export class GetUser {
  static readonly type = '[Users] Get user';
  constructor(public payload: { email: string }) { }
}

export class CreateUser {
  static readonly type = '[Users] Create user';
  constructor(public payload: { user: User }) { }
}
