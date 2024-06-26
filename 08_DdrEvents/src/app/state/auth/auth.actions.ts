export class Login {
  static readonly type = '[Auth] Login';
  constructor(public payload: { email: string, password: string }) { }
}

/*
NOTA: El payload `{ email: string, password: string }` también podría ser
de tipo User, aunque debe tenerse cuidado si se modifica el modelo.
De cualquier manera, he seguido el modelo del curso para evitar confusiones.
*/
