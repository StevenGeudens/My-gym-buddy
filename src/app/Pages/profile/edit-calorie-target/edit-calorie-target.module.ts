import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditCalorieTargetPageRoutingModule } from './edit-calorie-target-routing.module';

import { EditCalorieTargetPage } from './edit-calorie-target.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditCalorieTargetPageRoutingModule
  ],
  declarations: [EditCalorieTargetPage]
})
export class EditCalorieTargetPageModule {}
