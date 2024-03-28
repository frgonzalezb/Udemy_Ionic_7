import { Pipe, PipeTransform } from '@angular/core';
import Pokemon from '../models/pokemon';

@Pipe({
  name: 'getStat'
})
export class GetStatPipe implements PipeTransform {

  transform(value: Pokemon, nameStat: string): number {

    const statFound = value.stats.find(s => s.stat.name == nameStat);

    if (statFound) {
      console.log(statFound); // dbg
      
      return statFound.base_stat;
    }
    return 0;
  }

}
