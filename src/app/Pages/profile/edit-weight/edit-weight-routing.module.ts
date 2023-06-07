import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditWeightPage } from './edit-weight.page';

const routes: Routes = [
  {
    path: '',
    component: EditWeightPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditWeightPageRoutingModule {}
