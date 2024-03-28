import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import Pokemon from 'src/app/models/pokemon';
import { LoadingController, NavController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-list-all-pokemon',
  templateUrl: './list-all-pokemon.page.html',
  styleUrls: ['./list-all-pokemon.page.scss'],
})
export class ListAllPokemonPage implements OnInit {

  public pokemonArray: Pokemon[];

  constructor(
      private _pokemon: PokemonService,
      private loadingController: LoadingController,
      private navParams: NavParams,
      private navController: NavController
    ) {
    this.pokemonArray = [];
  }

  ngOnInit() {
    this.morePokemon();
  }

  async morePokemon($event: any | null = null) {
    const promise = this._pokemon.getAllPokemon();

    if (promise) {

      let loading: any = null;
      if (!$event) {
        loading = await this.loadingController.create({
          message: 'Cargando...'
        });
        await loading.present();
      }

      promise.then((result: Pokemon[]) => {
        console.log(result); // dbg

        this.pokemonArray = this.pokemonArray.concat(result);
        console.log(this.pokemonArray); // dbg

        if ($event) {
          $event.target.complete();
        }
        setTimeout(() => {
          if (loading) {
            loading.dismiss();
          }
        }, 2000);
      }).catch((error) => {
        console.error(error); // dbg
        if ($event) {
          $event.target.complete();
        }
        if (loading) {
          loading.dismiss();
        }
      });
    }
  }

  goToDetail(pokemon: Pokemon) {
    this.navParams.data['pokemon'] = pokemon;
    this.navController.navigateForward('detail-pokemon');
  }

}
