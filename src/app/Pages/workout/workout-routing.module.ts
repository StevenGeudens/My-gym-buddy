import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkoutPage } from './workout.page';
import { WorkoutBuilderPage } from './workout-builder/workout-builder.page';

const routes: Routes = [
  {
    path: '',
    component: WorkoutPage
  },
  {
    path: 'workout-builder',
    loadChildren: () => import('./workout-builder/workout-builder.module').then( m => m.WorkoutBuilderPageModule)
  },
  {
    path: 'workout-builder/:id',
    loadChildren: () => import('./workout-builder/workout-builder.module').then( m => m.WorkoutBuilderPageModule)
  },
  {
    path: 'detail/:id',
    loadChildren: () => import('./detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'profile',
    redirectTo: '/profile',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutPageRoutingModule {}
