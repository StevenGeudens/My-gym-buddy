import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WeightPageRoutingModule } from './weight-routing.module';

import { WeightPage } from './weight.page';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WeightPageRoutingModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    })
  ],
  declarations: [WeightPage]
})
export class WeightPageModule {}
