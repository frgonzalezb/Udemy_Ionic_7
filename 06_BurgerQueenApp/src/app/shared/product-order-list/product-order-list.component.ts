import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { UserOrderService } from 'src/app/services/user-order.service';
import { SelectedExtrasPipe } from '../selected-extras/selected-extras.pipe';

@Component({
  selector: 'app-product-order-list',
  templateUrl: './product-order-list.component.html',
  styleUrls: ['./product-order-list.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    SelectedExtrasPipe
  ]
})
export class ProductOrderListComponent {

  constructor(
    public _userOrder: UserOrderService
  ) { }

}
