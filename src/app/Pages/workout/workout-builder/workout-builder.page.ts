import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, ItemReorderEventDetail, ModalController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { Exercise } from 'src/app/types/workout-types/exercise';
import { Set } from 'src/app/types/workout-types/set';
import { AddExercisePage } from './add-exercise/add-exercise.page';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-workout-builder',
  templateUrl: './workout-builder.page.html',
  styleUrls: ['./workout-builder.page.scss'],
})
export class WorkoutBuilderPage implements OnInit, OnDestroy {
  title = '';
  emptyTitle: string;
  exercises: Exercise[] = [];

  id?: string = null;
  private workoutSubscription: Subscription;
  private titleSubscription: Subscription;

  constructor(
    public modalController: ModalController,
    private alertController: AlertController,
    private dbService: DatabaseService,
    private router: Router,
    public activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
    this.setData();
    this.titleSubscription = this.dbService.retrieveWorkouts().subscribe(w => this.emptyTitle = `Workout ${w.length + 1}`);
  }

  ngOnDestroy() {
    if (this.workoutSubscription){
      this.workoutSubscription.unsubscribe();
    }
    this.titleSubscription.unsubscribe();
  }

  async setData(): Promise<void> {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id === null){
      return;
    }

    this.id = id;

    this.workoutSubscription = this.dbService.retrieveWorkoutViaId(this.id).subscribe(w => {
      this.title = w.title;
      this.exercises = w.exercises;
    });
  }

  async addExercise(): Promise<void> {
    const modal = await this.modalController.create({
      component: AddExercisePage,
      animated: true,
      backdropDismiss: false
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    if (data) {
      data.forEach(e => {

        // Add a default set to the exercise
        e.sets = [{nr: 1, reps: 5, kg: 0}];

        this.exercises.push(e);
      });
    }
  }

  addSet(exercise: Exercise): void {
    exercise.sets.push({nr: exercise.sets.length + 1, reps: 5, kg: 0});
  }

  handleReorder(event: CustomEvent<ItemReorderEventDetail>, exercise: Exercise) {

    // Move the set in the sets array of the exercise
    const movedExercise = exercise.sets.splice(event.detail.from, 1)[0];
    exercise.sets.splice(event.detail.to, 0, movedExercise);

    // Renumber the exercises
    exercise.sets.forEach((e, index) => {
      e.nr = index + 1;
    });

    event.detail.complete();
  }

  deleteSet(exercise: Exercise, set: Set): void {
    exercise.sets = exercise.sets.filter(value => value.nr != set.nr);
    // Renumber the exercises
    exercise.sets.forEach((e, index) => {
      e.nr = index + 1;
    });
  }

  async deleteExercise(exercise: Exercise): Promise<void> {
    const deleteConfirmAlert = await this.alertController.create({
      header: 'Are you sure?',
      message: 'The added exercise will be deleted from you\'re workout',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Delete',
          role: 'confirm',
          cssClass: 'alert-button-delete'
        },
      ],
    });

    await deleteConfirmAlert.present();
    const { role } = await deleteConfirmAlert.onDidDismiss();
    if (role === 'confirm'){
      this.exercises = this.exercises.filter(value => value.name != exercise.name);
    }
  }

  async save() {
    if (this.title === '') {
      this.title = this.emptyTitle;
    }
    if (this.id === null) {
      await this.dbService.saveWorkout(this.title, this.exercises, false);
    } else {
      await this.dbService.updateWorkout(this.id, this.title, this.exercises, false);
    }

    await this.router.navigate(['/tabs/workout']);
  }
}
