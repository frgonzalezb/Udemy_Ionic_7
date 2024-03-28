import { Component } from '@angular/core';
import { Flashlight } from '@awesome-cordova-plugins/flashlight/ngx'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public active: boolean;

  constructor(private flashlight: Flashlight) {
    this.active = false;
  }

  flash() {
    if (this.active) {
      this.flashlight.switchOn();
    } else {
      this.flashlight.switchOff();
    }
  }

}
