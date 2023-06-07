import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { Subscription } from 'rxjs';
import { UserInfo } from '../../types/user-types/userInfo';
import { Weight } from '../../types/user-types/weight';
import { Timestamp } from 'firebase/firestore';
import { FormBuilder } from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {EditCalorieTargetPage} from './edit-calorie-target/edit-calorie-target.page';
import {EditWeightPage} from './edit-weight/edit-weight.page';
import {EditHeightPage} from './edit-height/edit-height.page';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  currentWeight: Weight;
  userInfo: UserInfo;
  dateNow: Timestamp = Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0)));

  userInfoSubscription: Subscription;

  constructor(
    public authService: AuthService,
    private dbService: DatabaseService,
    public formBuilder: FormBuilder,
    private modalController: ModalController) { }

  ngOnInit() {
    this.setData();
  }

  async setData(): Promise<void> {
    this.userInfoSubscription = await this.dbService.retrieveUserInfo().subscribe(async value => {
      this.userInfo = value[0];

      let latestWeight = value[0].weightHistory[0];
      for (const item of value[0].weightHistory) {
        if (latestWeight.date < item.date) {
          latestWeight = item;
        }
      }
      this.currentWeight = latestWeight;
    });
  }

  async editCalorieIntake(): Promise<void> {
    const modal = await this.modalController.create({
      component: EditCalorieTargetPage,
      animated: true,
      cssClass: 'user-info-modal',
      componentProps: {
        calorieTarget: this.userInfo.calorieTarget
      }
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    if (data) {
      await this.dbService.updateUserInfo(this.userInfo.id  ,this.userInfo.weightHistory, this.userInfo.height, data.calorieTarget);
    }
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

  async editHeight(): Promise<void> {
    const modal = await this.modalController.create({
      component: EditHeightPage,
      animated: true,
      cssClass: 'user-info-modal',
      componentProps: {
        height: this.userInfo.height
      }
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    if (data) {
      await this.dbService.updateUserInfo(this.userInfo.id  ,this.userInfo.weightHistory, data.height, this.userInfo.calorieTarget);
    }
  }

  async signOut() {
    await this.authService.signOut();
  }

}
