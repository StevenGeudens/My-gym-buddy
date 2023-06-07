import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectDatePageRoutingModule } from './select-date-routing.module';

import { SelectDatePage } from './select-date.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectDatePageRoutingModule
  ],
  declarations: [SelectDatePage]
})
export class SelectDatePageModule {}
