import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { ProductsService } from './products.service';
import Product from 'src/app/models/product';
import { GetProductById, GetProductsByCategory } from './products.actions';

export class ProductsStateModel {
  public products!: Product[];
  public product!: Product | null;
}

const defaults = {
  products: [],
  product: null,
};

@State<ProductsStateModel>({
  name: 'products',
  defaults
})
@Injectable()
export class ProductsState {

  @Selector()
  static products(state: ProductsStateModel) {
    return state.products;
  }

  @Selector()
  static product(state: ProductsStateModel) {
    return state.product;
  }

  constructor(private _products: ProductsService) {}

  @Action(GetProductsByCategory)
  async getProductsByCategory(
    { getState, setState }: StateContext<ProductsStateModel>,
    { payload }: GetProductsByCategory
    ) {
    const res = await this._products.getProductsByCategory(payload.idCategory)
      .then((products: Product[]) => {
        const state = getState();
        setState({
          ...state,
          products
        });
      }
    );
    return res;
  }

  @Action(GetProductById)
  getProductById(
    { getState, setState }: StateContext<ProductsStateModel>,
    { payload }: GetProductById
    ) {
    return this._products.getProductById(payload.id)
      .then((product: Product) => {
      const state = getState();
        setState({
          ...state,
          product
        });
      }
    );
  }

}
