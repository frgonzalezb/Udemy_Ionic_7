import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CouponCardsPage } from './coupon-cards.page';

const routes: Routes = [
  {
    path: '',
    component: CouponCardsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CouponCardsPageRoutingModule {}
