import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListAllPokemonPageRoutingModule } from './list-all-pokemon-routing.module';

import { ListAllPokemonPage } from './list-all-pokemon.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListAllPokemonPageRoutingModule
  ],
  declarations: [ListAllPokemonPage]
})
export class ListAllPokemonPageModule {}
