import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditCalorieTargetPage } from './edit-calorie-target.page';

const routes: Routes = [
  {
    path: '',
    component: EditCalorieTargetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditCalorieTargetPageRoutingModule {}
