import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditWeightPageRoutingModule } from './edit-weight-routing.module';

import { EditWeightPage } from './edit-weight.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditWeightPageRoutingModule
  ],
  declarations: [EditWeightPage]
})
export class EditWeightPageModule {}
