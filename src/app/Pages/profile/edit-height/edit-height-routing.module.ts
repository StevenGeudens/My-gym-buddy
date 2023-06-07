import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditHeightPage } from './edit-height.page';

const routes: Routes = [
  {
    path: '',
    component: EditHeightPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditHeightPageRoutingModule {}
