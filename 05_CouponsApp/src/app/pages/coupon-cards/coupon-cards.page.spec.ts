import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CouponCardsPage } from './coupon-cards.page';

describe('CouponCardsPage', () => {
  let component: CouponCardsPage;
  let fixture: ComponentFixture<CouponCardsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CouponCardsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
