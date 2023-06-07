import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkoutBuilderPageRoutingModule } from './workout-builder-routing.module';

import { WorkoutBuilderPage } from './workout-builder.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkoutBuilderPageRoutingModule
  ],
  declarations: [WorkoutBuilderPage]
})
export class WorkoutBuilderPageModule {}
