import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonInfiniteScroll } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Exercise } from 'src/app/types/workout-types/exercise';
import { firstValueFrom } from 'rxjs';
import { FilterPage } from './filter/filter.page';

@Component({
  selector: 'app-add-exercise',
  templateUrl: './add-exercise.page.html',
  styleUrls: ['./add-exercise.page.scss'],
})
export class AddExercisePage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  exercises: Exercise[] = [];
  #offset = 0;
  searchText = '';
  checkedExercises: Exercise[] = [];
  requestPending: boolean;

  selectedMuscleOption = '';
  selectedTypeOption = '';
  selectedDifficultyOption = '';

  constructor(public modalController: ModalController, public apiService: ApiService) {
    this.retrievePage();
   }

  ngOnInit() {
  }

  async dismiss() {
    await this.modalController.dismiss();
  }

  async loadData(event): Promise<void> {
    const noResults = await this.retrievePage();
    event.target.complete();
    if (noResults) {
      event.target.disabled = true;
    }
  }

  async searchChangeHandler(event: any): Promise<void> {
    this.searchText = event.detail.value;
    await this.retrievePage(true);
  }

  onChange(exercise: Exercise): void {
     if(this.checkedExercises.find(ex => ex.name == exercise.name) !== undefined) {
       this.checkedExercises = this.checkedExercises.filter((value) => value.name != exercise.name);
     } else {
       this.checkedExercises.push(exercise);
     }
   }

   checkIsChecked(exercise: Exercise): boolean {
    return this.checkedExercises.find(ex => ex.name == exercise.name) !== undefined;
   }

   async filter(): Promise<void> {
    const modal = await this.modalController.create({
      component: FilterPage,
      animated: true,
      breakpoints: [0, 0.90],
      initialBreakpoint: 0.90,
      componentProps: {
        selectedMuscleOption: this.selectedMuscleOption,
        selectedTypeOption: this.selectedTypeOption,
        selectedDifficultyOption: this.selectedDifficultyOption
      }
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    if (data) {
      this.selectedMuscleOption = data.selectedMuscleOption;
      this.selectedTypeOption = data.selectedTypeOption;
      this.selectedDifficultyOption = data.selectedDifficultyOption;
      await this.retrievePage(true);
    }
  }

  async addToWorkout() {
    await this.modalController.dismiss(this.checkedExercises);
  }

  // Returns true if there are no more results else false
  private async retrievePage(reset = false): Promise<boolean> {
    this.requestPending = true;
    if (reset) {
      this.#offset = 0;
    }

    const result = await firstValueFrom(this.apiService.getExercises(
      this.#offset,
      this.searchText,
      this.selectedMuscleOption,
      this.selectedTypeOption,
      this.selectedDifficultyOption));

    this.requestPending = false;

    if (reset) {
      this.exercises = [];
    }

    if (result.length === 0){
      return true;
    } else {
      this.#offset += 10;
      this.exercises.push(...result);
      return false;
    }
  }
}
