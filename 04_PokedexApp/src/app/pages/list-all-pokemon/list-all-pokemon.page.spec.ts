import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListAllPokemonPage } from './list-all-pokemon.page';

describe('ListAllPokemonPage', () => {
  let component: ListAllPokemonPage;
  let fixture: ComponentFixture<ListAllPokemonPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListAllPokemonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
