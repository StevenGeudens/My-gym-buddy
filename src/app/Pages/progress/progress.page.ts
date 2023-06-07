import { Component, OnInit, OnDestroy } from '@angular/core';
import { EChartsOption } from 'echarts';
import {Subscription} from 'rxjs';
import {UserInfo} from '../../types/user-types/userInfo';
import {DatabaseService} from '../../services/database.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
})
export class ProgressPage implements OnInit, OnDestroy {
  options: EChartsOption;
  chartData: EChartsOption;

  userInfo: UserInfo;
  currentWeight: number;
  bmi: number;
  bmiProgressBar: number;

  userInfoSubscription: Subscription;

  constructor(private dbService: DatabaseService) {}

  ngOnInit() {
    this.options = {
      color: ['#eb3d4e'],
      xAxis: {
        show: false,
        type: 'category',
        boundaryGap: false
      },
      yAxis: {
        show: false,
        type: 'value'
      }
    };

    this.setData();
  }

  ngOnDestroy() {
    this.userInfoSubscription.unsubscribe();
  }

  async setData(): Promise<void> {
    this.userInfoSubscription = this.dbService.retrieveUserInfo().subscribe(i => {
      this.userInfo = i[0];

      let latestWeight = this.userInfo.weightHistory[0];
      for (const item of this.userInfo.weightHistory) {
        if (latestWeight.date < item.date) {
          latestWeight = item;
        }
      }
      this.currentWeight = latestWeight.kg;
      const weightHistoryKg = [];
      const weightHistoryDate = [];
      this.userInfo.weightHistory.map(w => {
        weightHistoryKg.push(w.kg);
        weightHistoryDate.push(w.date.toDate().toLocaleDateString('en-GB'));
      });

      this.chartData = {
        series: [
          {
            data: weightHistoryKg,
            type: 'line',
            areaStyle: {}
          }
        ],
        xAxis: {
          data: weightHistoryDate
        }
      };

      this.bmi = this.calculateBMI(this.currentWeight, this.userInfo.height);
      this.bmiProgressBar = this.bmi / 50;
    });
  }

  calculateBMI(weight: number, height: number): number {
    const BMI = weight / (height * height);
    // round to 1 decimal
    return Math.round(BMI * 10) / 10;
  }

}
