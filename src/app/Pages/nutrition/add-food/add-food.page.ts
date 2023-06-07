import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { from, Observable, Subscription } from 'rxjs';
import { FoodItem } from 'src/app/types/nutrition-types/foodItem';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { ToastController } from '@ionic/angular';
import { DayOfEating } from 'src/app/types/nutrition-types/dayOfEating';

@Component({
  selector: 'app-add-food',
  templateUrl: './add-food.page.html',
  styleUrls: ['./add-food.page.scss'],
})
export class AddFoodPage implements OnInit, OnDestroy {
  dayOfEating: DayOfEating;
  dayOfEatingSubscription: Subscription;

  searchText: string;
  foodItemsObservable: Observable<FoodItem[]> = from([]);

  selectedMeal: string;
  mealOptions: string[] = ['breakfast', 'lunch', 'dinner', 'snacks'];

  constructor(
    public apiService: ApiService,
    public activatedRoute: ActivatedRoute,
    private dbService: DatabaseService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.retrievePage();

    const selectedMeal = this.activatedRoute.snapshot.paramMap.get('meal');
    this.selectedMeal = this.mealOptions.find(meal => meal === selectedMeal);

    const dayOfEatingId = this.activatedRoute.snapshot.paramMap.get('id');
    this.dayOfEatingSubscription = this.dbService.retrieveDayOfEatingViaId(dayOfEatingId).subscribe(value => this.dayOfEating = value);
  }

  ngOnDestroy(): void {
      this.dayOfEatingSubscription.unsubscribe();
  }

  async searchChangeHandler(event: any): Promise<void> {
    this.searchText = event.detail.value;
    await this.retrievePage();
  }


  handleChange(ev): void {
    this.selectedMeal = ev.target.value;
  }

  async addFoodItem(foodItem: FoodItem): Promise<void> {
    foodItem.calories = Math.round(foodItem.calories);

    switch(this.selectedMeal) {
      case 'breakfast':
        this.dayOfEating.breakfast.push(foodItem);
        break;
      case 'lunch':
        this.dayOfEating.lunch.push(foodItem);
        break;
      case 'dinner':
        this.dayOfEating.dinner.push(foodItem);
        break;
      case 'snacks':
        this.dayOfEating.snacks.push(foodItem);
        break;
    }
    await this.dbService.updateDayOfEating(
      this.dayOfEating.id,
      this.dayOfEating.breakfast,
      this.dayOfEating.lunch,
      this.dayOfEating.dinner,
      this.dayOfEating.snacks
    ).then(async () => {
      const toast = await this.toastController.create({
        message: `${foodItem.name} added to ${this.selectedMeal}!`,
        duration: 1000,
        position: 'top',
        icon: 'checkmark-circle',
        cssClass: 'success-toast',
        buttons: [
          {
            icon: 'close-outline',
            role: 'cancel'
          }
        ]
      });
      toast.present();
    });
  }

  round(num: number): number {
    return Math.round(num);
  }

  private async retrievePage(): Promise<void> {
    this.foodItemsObservable = this.apiService.getFoodItems(this.searchText);
  }

}
