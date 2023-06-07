import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetUserInfoPage } from './set-user-info.page';

const routes: Routes = [
  {
    path: '',
    component: SetUserInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetUserInfoPageRoutingModule {}
