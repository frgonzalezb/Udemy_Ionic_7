import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { GetCategories } from './categories.actions';
import Category from '../../models/category';
import { CategoriesService } from './categories.service';

export class CategoriesStateModel {
  public categories: Category[] = [];
}

const defaults = {
  categories: []
};

@State<CategoriesStateModel>({
  name: 'categories',
  defaults
})
@Injectable()
export class CategoriesState {

  @Selector()
  static categories(state: CategoriesStateModel) {
    return state.categories;
  }

  constructor(private _categories: CategoriesService) {}

  @Action(GetCategories)
  async getCategories({ setState }: StateContext<CategoriesStateModel>) {
    const categories = await this._categories.getCategories();
    setState({
      categories
    });
  }
}
