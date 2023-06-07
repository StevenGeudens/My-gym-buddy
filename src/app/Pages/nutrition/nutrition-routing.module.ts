import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NutritionPage } from './nutrition.page';

const routes: Routes = [
  {
    path: '',
    component: NutritionPage
  },
  {
    path: 'add-food/:meal/:id',
    loadChildren: () => import('./add-food/add-food.module').then( m => m.AddFoodPageModule)
  },
  {
    path: 'select-date',
    loadChildren: () => import('./select-date/select-date.module').then( m => m.SelectDatePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NutritionPageRoutingModule {}
