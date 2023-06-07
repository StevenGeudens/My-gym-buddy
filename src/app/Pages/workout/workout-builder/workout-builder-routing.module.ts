import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkoutBuilderPage } from './workout-builder.page';

const routes: Routes = [
  {
    path: '',
    component: WorkoutBuilderPage
  },
  {
    path: 'add-exercise',
    loadChildren: () => import('./add-exercise/add-exercise.module').then( m => m.AddExercisePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutBuilderPageRoutingModule {}
