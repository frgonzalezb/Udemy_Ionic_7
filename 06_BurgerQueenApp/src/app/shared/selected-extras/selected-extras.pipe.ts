import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import ProductExtra from 'src/app/models/product-extra';

@Pipe({
  name: 'selectedExtras',
  standalone: true
})
export class SelectedExtrasPipe implements PipeTransform {

  constructor(private _translate: TranslateService) {}

  transform(value: ProductExtra[]): string[] {
    let optionSelected: string[] = [];

    value.forEach(extra => {
      extra.blocks?.forEach(block => {
        if (block.options.length == 1 && block.options[0].activate) {
          optionSelected.push(this._translate.instant(block.name));
        } else {
          const option = block.options.find(op => op.activate);
          if (option && option.name) {
            optionSelected.push(this._translate.instant(block.name) + ': ' + this._translate.instant(option.name));
          }
        }
      });
    });
    
    return optionSelected;
  }

}
