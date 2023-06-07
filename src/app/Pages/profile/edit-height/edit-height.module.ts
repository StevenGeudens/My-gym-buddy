import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditHeightPageRoutingModule } from './edit-height-routing.module';

import { EditHeightPage } from './edit-height.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditHeightPageRoutingModule
  ],
  declarations: [EditHeightPage]
})
export class EditHeightPageModule {}
