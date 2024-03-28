import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListAllPokemonPage } from './list-all-pokemon.page';

const routes: Routes = [
  {
    path: '',
    component: ListAllPokemonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListAllPokemonPageRoutingModule {}
