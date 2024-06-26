import { Component, OnInit } from '@angular/core';
import User from 'src/app/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  public user: User;

  constructor() {
    this.user = new User();
  }

  ngOnInit() {}

  login() {

  }

}
