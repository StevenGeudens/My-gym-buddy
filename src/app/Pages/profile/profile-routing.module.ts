import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  },
  {
    path: 'edit-calorie-target',
    loadChildren: () => import('./edit-calorie-target/edit-calorie-target.module').then( m => m.EditCalorieTargetPageModule)
  },
  {
    path: 'edit-height',
    loadChildren: () => import('./edit-height/edit-height.module').then( m => m.EditHeightPageModule)
  },
  {
    path: 'edit-weight',
    loadChildren: () => import('./edit-weight/edit-weight.module').then(m => m.EditWeightPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
