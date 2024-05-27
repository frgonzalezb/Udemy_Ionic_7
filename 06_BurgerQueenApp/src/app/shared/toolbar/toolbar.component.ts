import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EventType, Router, RoutesRecognized } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { UserOrderService } from 'src/app/services/user-order.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, TranslateModule, LoginComponent]
})
export class ToolbarComponent implements OnInit {

  public showBack: boolean;
  public showUserInfo: boolean;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    public _userOrder: UserOrderService
  ) {
    this.showBack = false;
    this.showUserInfo = false;
  }

  ngOnInit() {
    this.router.events.pipe(
      filter((event) => event.type === EventType.RoutesRecognized)
    ).subscribe({
      next: (event: any) => {
        console.log(event.state.root.firstChild?.data); // dbg
        this.showBack = event.state.root.firstChild?.data['showBack'];
      }
    });
  }

  goBack() {
    this.navCtrl.back();
  }

  logout() {
    // this._userOrder.logout();
    // this.showUserInfo = false;
  }

  showUserInfoPanel() {
    this.showUserInfo = true;
  }

}
