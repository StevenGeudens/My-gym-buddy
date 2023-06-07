import {Component, OnDestroy, OnInit} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EChartsOption } from 'echarts';
import {Subscription} from 'rxjs';
import {DatabaseService} from '../../../services/database.service';
import {UserInfo} from '../../../types/user-types/userInfo';
import {EditWeightPage} from '../../profile/edit-weight/edit-weight.page';
import {Timestamp} from 'firebase/firestore';
import {Weight} from '../../../types/user-types/weight';

@Component({
  selector: 'app-weight',
  templateUrl: './weight.page.html',
  styleUrls: ['./weight.page.scss'],
})
export class WeightPage implements OnInit, OnDestroy {
  options: EChartsOption;
  chartData: EChartsOption;
  userInfo: UserInfo;
  currentWeight: Weight;
  dateNow: Timestamp = Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0)));
  userInfoSubscription: Subscription;

  constructor(private modalController: ModalController, private dbService: DatabaseService) { }

  ngOnInit() {
    this.setData();

    this.options = {
      color: ['#eb3d4e'],
      xAxis: {
        type: 'category',
        boundaryGap: false
      },
      yAxis: {
        type: 'value'
      }
    };
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
      this.currentWeight = latestWeight;
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
    });
  }

  async editWeight(): Promise<void> {
    const modal = await this.modalController.create({
      component: EditWeightPage,
      animated: true,
      cssClass: 'user-info-modal',
      componentProps: {
        weight: this.currentWeight
      }
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    if (data) {
      if (data.weight.date.isEqual(this.dateNow)) {
        // Update
        this.userInfo.weightHistory.find(w => w.date.isEqual(this.dateNow)).kg = data.weight.kg;
      } else {
        // Add weight
        this.userInfo.weightHistory.push({kg: data.weight.kg, date: this.dateNow});
      }
      await this.dbService.updateUserInfo(this.userInfo.id, this.userInfo.weightHistory, this.userInfo.height, this.userInfo.calorieTarget);
    }
  }
}
