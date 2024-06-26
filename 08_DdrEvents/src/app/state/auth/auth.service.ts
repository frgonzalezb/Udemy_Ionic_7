import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth;

  constructor() {
    this.auth = inject(Auth);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {

  }

}
