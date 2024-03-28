import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailPokemonPageRoutingModule } from './detail-pokemon-routing.module';

import { DetailPokemonPage } from './detail-pokemon.page';
import { GetStatPipe } from 'src/app/pipes/get-stat.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailPokemonPageRoutingModule
  ],
  declarations: [DetailPokemonPage, GetStatPipe]
})
export class DetailPokemonPageModule {}
