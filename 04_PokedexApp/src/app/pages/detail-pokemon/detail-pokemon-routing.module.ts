import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailPokemonPage } from './detail-pokemon.page';

const routes: Routes = [
  {
    path: '',
    component: DetailPokemonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailPokemonPageRoutingModule {}
