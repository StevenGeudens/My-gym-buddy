import { Component, OnInit, OnDestroy } from '@angular/core';
import {from, Observable, Subscription} from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';
import { ApiService } from '../../services/api.service';
import { Quote } from '../../types/quote';
import { UserInfo } from '../../types/user-types/userInfo';
import { ModalController } from '@ionic/angular';
import {Timestamp} from 'firebase/firestore';
import {EChartsOption} from 'echarts';
import {DayOfEating} from '../../types/nutrition-types/dayOfEating';
import {SetUserInfoPage} from './set-user-info/set-user-info.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  // quote
  quoteObservable: Observable<Quote[]> = from([]);
  quote: string;
  author: string;
  quoteSubscription: Subscription;

  // workout
  workoutSubscription: Subscription;
  completedWorkouts: number;
  incompleteWorkouts: number;

  // nutrition
  calorieIntake: number;
  caloriesRemaining: number;

  nutritionChartOptions: EChartsOption;
  nutritionChartData: EChartsOption;

  daysOfEatingSubscription: Subscription;
  daysOfEating: DayOfEating[];
  dayOfEating: DayOfEating;

  dateToday: Date = new Date(new Date().setHours(0,0,0,0));

  // progress
  progressChartOptions: EChartsOption;
  progressChartData: EChartsOption;

  bmi: number;
  bmiProgressBar: number;

  currentWeight: number;

  // user info
  userInfoSubscription: Subscription;
  userInfo: UserInfo;

  constructor(public apiService: ApiService, private dbService: DatabaseService, private modalController: ModalController) {

   }

  ngOnInit() {
    this.quoteObservable = this.apiService.getQuote();
    this.quoteSubscription = this.quoteObservable.subscribe(x => {
      this.quote = x[0].quote;
      this.author = x[0].author;
    });

    this.workoutSubscription = this.dbService.retrieveWorkouts().subscribe(workout => {
      this.completedWorkouts = workout.filter(w => w.complete).length;
      this.incompleteWorkouts = workout.filter(w => !w.complete).length;
    });

    this.setData();

    this.nutritionChartOptions = {
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

    this.progressChartOptions = {
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
  }

  ngOnDestroy() {
    this.quoteSubscription.unsubscribe();
    this.workoutSubscription.unsubscribe();
    this.daysOfEatingSubscription.unsubscribe();
    this.userInfoSubscription.unsubscribe();
  }

  async setData(): Promise<void> {
    this.userInfoSubscription = this.dbService.retrieveUserInfo().subscribe(async i => {
      this.userInfo = i[0];

      if (!this.userInfo) {
        const modal = await this.modalController.create({
          component: SetUserInfoPage,
          animated: true
        });
        await modal.present();
      } else {

        this.setDayOfEating();

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

        this.progressChartData = {
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
      }
    });
  }

  setDayOfEating(): void {
    this.daysOfEatingSubscription = this.dbService.retrieveDaysOfEating()
      .subscribe(async daysOfEating => {
        this.dayOfEating = daysOfEating.find(d => d.date.isEqual(Timestamp.fromDate(this.dateToday)));
        if (this.dayOfEating){
          this.calculateCalories();
        }
      });
  }

  calculateCalories(): void {
    let totalBreakfastCalories = 0;
    this.dayOfEating.breakfast.forEach(breakFastItem => totalBreakfastCalories += breakFastItem.calories);

    let totalLunchCalories = 0;
    this.dayOfEating.lunch.forEach(lunchItem => totalLunchCalories += lunchItem.calories);

    let totalDinnerCalories = 0;
    this.dayOfEating.dinner.forEach(dinnerItem => totalDinnerCalories += dinnerItem.calories);

    let totalSnacksCalories = 0;
    this.dayOfEating.snacks.forEach(snackItem => totalSnacksCalories += snackItem.calories);

    this.calorieIntake = totalBreakfastCalories + totalLunchCalories + totalDinnerCalories + totalSnacksCalories;
    const caloriesRemaining = this.userInfo.calorieTarget - this.calorieIntake;
    if (caloriesRemaining < 0) {
      this.caloriesRemaining = 0;
    } else {
      this.caloriesRemaining = caloriesRemaining;
    }

    this.nutritionChartData = {
      series: [{
        data: [
          { value: this.calorieIntake, name: 'Intake' },
          { value: this.caloriesRemaining, name: 'Remaining' }
        ]
      }]
    };
  }

  calculateBMI(weight: number, height: number): number {
    const BMI = weight / (height * height);
    // round to 1 decimal
    return Math.round(BMI * 10) / 10;
  }

}
