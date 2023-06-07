import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddFoodPage } from './add-food.page';

const routes: Routes = [
  {
    path: '',
    component: AddFoodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddFoodPageRoutingModule {}
