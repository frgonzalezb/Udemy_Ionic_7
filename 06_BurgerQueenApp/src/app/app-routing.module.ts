import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.module').then(m => m.CategoriesPageModule),
    data: { showBack: false }
  },
  {
    path: 'product-list',
    loadChildren: () => import('./pages/product-list/product-list.module').then(m => m.ProductListPageModule),
    data: { showBack: true }
  },
  {
    path: 'product',
    loadChildren: () => import('./pages/product/product.module').then(m => m.ProductPageModule),
    data: { showBack: true }
  },
  {
    path: 'payment',
    loadChildren: () => import('./pages/payment/payment.module').then(m => m.PaymentPageModule),
    data: { showBack: false }
  },
  {
    path: '',
    redirectTo: 'categories',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
