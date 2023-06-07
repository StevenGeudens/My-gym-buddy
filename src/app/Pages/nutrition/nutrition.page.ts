import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EChartsOption } from 'echarts';
import { DatabaseService } from '../../services/database.service';
import {firstValueFrom, Subscription} from 'rxjs';
import { DayOfEating } from '../../types/nutrition-types/dayOfEating';
import { Timestamp } from 'firebase/firestore';
import { Router } from '@angular/router';
import { FoodItem } from '../../types/nutrition-types/foodItem';
import {SelectDatePage} from './select-date/select-date.page';
import {UserInfo} from '../../types/user-types/userInfo';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.page.html',
  styleUrls: ['./nutrition.page.scss'],
})
export class NutritionPage implements OnInit, OnDestroy {
  calorieIntake: number;
  caloriesRemaining: number;

  totalBreakfastCalories: number;
  totalLunchCalories: number;
  totalDinnerCalories: number;
  totalSnacksCalories: number;

  options: EChartsOption;
  chartData: EChartsOption;

  daysOfEatingSubscription: Subscription;
  daysOfEating: DayOfEating[];
  dayOfEating: DayOfEating;

  userInfo: UserInfo;

  selectedDate: Date = new Date(new Date().setHours(0,0,0,0));

  constructor(
    private modalController: ModalController,
    private dbService: DatabaseService,
    private router: Router) {}

  ngOnInit() {
    this.setData();

    this.options = {
      series: [
        {
          color: ['#eb3d4e', '#92949c'],
          name: 'Calories',
          type: 'pie',
          radius: ['60%', '90%'],
          label: {
            show: false
          },
          labelLine: {
            show: false
          }
        }
      ]
    };
  }

  ngOnDestroy() {
    this.daysOfEatingSubscription.unsubscribe();
  }

  async setData(): Promise<void> {
    await firstValueFrom(this.dbService.retrieveUserInfo()).then(i => this.userInfo = i[0]);
    this.setDayOfEating();
  }

  setDayOfEating(): void {
    this.daysOfEatingSubscription = this.dbService.retrieveDaysOfEating()
      .subscribe(async daysOfEating => {
        this.dayOfEating = daysOfEating.find(d => d.date.isEqual(Timestamp.fromDate(this.selectedDate)));
        // If the dayOfEating for the specified date does not exist => create
        if (!this.dayOfEating){
          await this.dbService.saveDayOfEating(this.selectedDate, [], [], [], []);
        } else {
          this.calculateCalories();
        }
      });
  }

  calculateCalories(): void {
    let totalBreakfastCalories = 0;
    this.dayOfEating.breakfast.forEach(breakFastItem => totalBreakfastCalories += breakFastItem.calories);
    this.totalBreakfastCalories = totalBreakfastCalories;

    let totalLunchCalories = 0;
    this.dayOfEating.lunch.forEach(lunchItem => totalLunchCalories += lunchItem.calories);
    this.totalLunchCalories = totalLunchCalories;

    let totalDinnerCalories = 0;
    this.dayOfEating.dinner.forEach(dinnerItem => totalDinnerCalories += dinnerItem.calories);
    this.totalDinnerCalories = totalDinnerCalories;

    let totalSnacksCalories = 0;
    this.dayOfEating.snacks.forEach(snackItem => totalSnacksCalories += snackItem.calories);
    this.totalSnacksCalories = totalSnacksCalories;

    this.calorieIntake = this.totalBreakfastCalories + this.totalLunchCalories + this.totalDinnerCalories + this.totalSnacksCalories;
    const caloriesRemaining = this.userInfo.calorieTarget - this.calorieIntake;
    if (caloriesRemaining < 0) {
      this.caloriesRemaining = 0;
    } else {
      this.caloriesRemaining = caloriesRemaining;
    }

    this.chartData = {
      series: [{
        data: [
          { value: this.calorieIntake, name: 'Intake' },
          { value: this.caloriesRemaining, name: 'Remaining' }
        ]
      }]
    };
  }

  async addFoodItem(meal: string): Promise<void> {
    await this.router.navigate(['tabs', 'nutrition', 'add-food', meal, this.dayOfEating.id]);
  }

  async deleteFoodItem(meal: string, foodItem: FoodItem): Promise<void> {
    switch(meal) {
      case 'breakfast':
        this.dayOfEating.breakfast = this.dayOfEating.breakfast.filter(value => value != foodItem);
        break;
      case 'lunch':
        this.dayOfEating.lunch = this.dayOfEating.lunch.filter(value => value != foodItem);
        break;
      case 'dinner':
        this.dayOfEating.dinner = this.dayOfEating.dinner.filter(value => value != foodItem);
        break;
      case 'snacks':
        this.dayOfEating.snacks = this.dayOfEating.snacks.filter(value => value != foodItem);
        break;
    }
    await this.dbService.updateDayOfEating(
      this.dayOfEating.id,
      this.dayOfEating.breakfast,
      this.dayOfEating.lunch,
      this.dayOfEating.dinner,
      this.dayOfEating.snacks
    );
  }

  async selectDate() {
    const modal = await this.modalController.create({
      component: SelectDatePage,
      animated: true,
      breakpoints: [0, 0.60],
      initialBreakpoint: 0.60,
      componentProps: {
        // use of addHours function => otherwise the selected date in the calendar is a day to early
      selectedDate: this.addHours(this.dayOfEating.date.toDate(), 1).toISOString()
      }
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    if (data) {
      this.selectedDate = new Date(new Date(data.date).setHours(0,0,0,0));
      this.setDayOfEating();
    }
  }
  addHours(date, hours): Date {
    date.setHours(date.getHours() + hours);
    return date;
  }
}
