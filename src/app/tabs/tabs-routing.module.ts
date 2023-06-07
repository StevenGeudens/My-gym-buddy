import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../Pages/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'workout',
        loadChildren: () => import('../Pages/workout/workout.module').then(m => m.WorkoutPageModule)
      },
      {
        path: 'nutrition',
        loadChildren: () => import('../Pages/nutrition/nutrition.module').then(m => m.NutritionPageModule)
      },
      {
        path: 'progress',
        loadChildren: () => import('../Pages/progress/progress.module').then(m => m.ProgressPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'profile',
    loadChildren: () => import('../Pages/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
