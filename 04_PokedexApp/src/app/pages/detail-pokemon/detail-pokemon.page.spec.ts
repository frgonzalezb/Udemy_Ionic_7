import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailPokemonPage } from './detail-pokemon.page';

describe('DetailPokemonPage', () => {
  let component: DetailPokemonPage;
  let fixture: ComponentFixture<DetailPokemonPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetailPokemonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
