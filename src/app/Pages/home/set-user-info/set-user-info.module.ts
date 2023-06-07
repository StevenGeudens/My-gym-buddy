import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetUserInfoPageRoutingModule } from './set-user-info-routing.module';

import { SetUserInfoPage } from './set-user-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetUserInfoPageRoutingModule
  ],
  declarations: [SetUserInfoPage]
})
export class SetUserInfoPageModule {}
