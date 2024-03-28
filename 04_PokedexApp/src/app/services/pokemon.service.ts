import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import Pokemon from '../models/pokemon';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private nextUrl: string;
  private params: string;

  constructor() {
    this.params = 'pokemon?offset=0&limit=20';
    this.nextUrl = environment.urlApi + this.params;
  }

  getAllPokemon() {
    const url = this.nextUrl;

    if (!url) {
      return null;
    }

    const options = {
      url,
      headers: {},
      params: {},
    };

    return CapacitorHttp.get(options).then(async (response) => {
      console.log(response); // dbg
      
      let pokemonArray: Pokemon[] = [];

      if (response.data) {
        const results = response.data.results;
        this.nextUrl = response.data.next;

        const promises: Promise<HttpResponse>[] = [];

        for (let index = 0; index < results.length; index++) {
          const pokemon = results[index];
          const urlPokemon = pokemon.url;
          const options = {
            url: urlPokemon,
            headers: {},
            params: {},
          }
          promises.push(CapacitorHttp.get(options));
        }
        await Promise.all(promises).then((responses) => {
          console.log(responses); // dbg

          for (const response of responses) {
            // Obtener los datos específicos de cada pokemon
            const pokemonData = response.data;

            const pokemonObj = new Pokemon();

            pokemonObj.id = pokemonData.id;
            pokemonObj.name = pokemonData.name;
            pokemonObj.type1 = pokemonData.types[0].type.name;

            if (pokemonData.types[1]) {
              pokemonObj.type2 = pokemonData.types[1].type.name;
            }

            pokemonObj.sprite = pokemonData.sprites.front_default;
            pokemonObj.height = pokemonData.height / 10;
            pokemonObj.weight = pokemonData.weight / 10;
            pokemonObj.abilities = pokemonData.abilities
              .filter((ab: any) => !ab.is_hidden)
              .map((ab: any) => ab.ability.name);

            const hiddenAbility = pokemonData.abilities
              .find((ab: any) => ab.is_hidden);

            if (hiddenAbility) {
              pokemonObj.hiddenAbility = hiddenAbility.ability.name;
            }
            
            pokemonObj.stats = pokemonData.stats;

            pokemonArray.push(pokemonObj);
          }
        });
      }

      return pokemonArray;
    });
  }

}
