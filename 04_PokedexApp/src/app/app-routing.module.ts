import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list-all-pokemon',
    pathMatch: 'full'
  },
  {
    path: 'detail-pokemon',
    loadChildren: () => import('./pages/detail-pokemon/detail-pokemon.module').then( m => m.DetailPokemonPageModule)
  },
  {
    path: 'list-all-pokemon',
    loadChildren: () => import('./pages/list-all-pokemon/list-all-pokemon.module').then( m => m.ListAllPokemonPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
