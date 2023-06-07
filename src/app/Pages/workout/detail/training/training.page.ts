import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { Exercise } from 'src/app/types/workout-types/exercise';
import { Set } from 'src/app/types/workout-types/set';
import { CompletePage } from './complete/complete.page';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-training',
  templateUrl: './training.page.html',
  styleUrls: ['./training.page.scss'],
})
export class TrainingPage implements OnInit {
  id: string;
  title: string;
  exercises: Exercise[];

  timerMinutes = 0;
  timerSeconds = 0;
  timer = '00:00';
  interval;

  // The current displayed exercise
  activeExercise: Exercise;
  activeExerciseIndex = 0;
  // The current active set of the exercise
  activeSet: Set;
  activeSetIndex = 0;

  constructor(
    private dbService: DatabaseService,
    public activatedRoute: ActivatedRoute,
    public modalController: ModalController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.exercises.forEach(e => e.sets.forEach(s => s.complete = false));
    this.startTimer();
    this.activeExercise = this.exercises[this.activeExerciseIndex];
    this.activeSet = this.activeExercise.sets[this.activeSetIndex];
  }

  async close() {
    this.pauseTimer();
    const closeAlert = await this.alertController.create({
      header: this.timer,
      subHeader: this.title,
      animated: true,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Complete workout',
          role: 'complete',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Exit workout',
          role: 'exit',
          cssClass: 'alert-button-delete'
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        }
      ],
    });

    await closeAlert.present();
    const { role: roleCloseAlert } = await closeAlert.onDidDismiss();
    if (roleCloseAlert === 'exit'){
      const closeConfirmAlert = await this.alertController.create({
        header: 'Leave this workout?',
        message: 'Are you sure you want to leave this workout? your progress will be lost.',
        animated: true,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'alert-button-cancel'
          },
          {
            text: 'Yes, leave',
            role: 'exit',
            cssClass: 'alert-button-delete'
          },
        ],
      });

      await closeConfirmAlert.present();
      const { role: roleCloseConfirmAlert } = await closeConfirmAlert.onDidDismiss();
      if (roleCloseConfirmAlert === 'exit'){
        await this.modalController.dismiss();
      } else {
        this.startTimer();
        return;
      }
    } else  if (roleCloseAlert === 'complete') {
      const completeWorkoutAlert = await this.alertController.create({
        header: 'Complete your workout',
        message: 'Are you ready to complete your workout and save your progress?',
        animated: true,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'alert-button-cancel'
          },
          {
            text: 'Yes, complete',
            role: 'complete',
            cssClass: 'alert-button-delete'
          },
        ],
      });

      await completeWorkoutAlert.present();
      const { role: roleCompleteWorkoutAlert } = await completeWorkoutAlert.onDidDismiss();
      if (roleCompleteWorkoutAlert === 'complete'){
        await this.dbService.updateWorkout(this.id, this.title, this.exercises, true);
        await this.modalController.dismiss();
      } else {
        this.startTimer();
        return;
      }
    } else {
      this.startTimer();
      return;
    }
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timerMinutes === 59) {
        clearInterval(this.interval);
        this.timerMinutes = 0;
      } else if (this.timerSeconds === 59){
        this.timerMinutes++;
        this.timerSeconds = 0;
      } else {
        this.timerSeconds++;
      }
      this.updateTimer();
    }, 1000);
  }

  updateTimer() {
    this.timer = `${String(this.timerMinutes).padStart(2, '0')}:${String(this.timerSeconds).padStart(2, '0')}`;
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  async next() {
    await Haptics.impact({ style: ImpactStyle.Medium });

    // If the index of the active set is smaller than the index of the last set in the exercise go to next set
    if (this.activeSetIndex < this.activeExercise.sets.length - 1) {
      this.activeSetIndex++;
      this.activeSet.complete = true;
      this.activeSet = this.activeExercise.sets[this.activeSetIndex];
    }
    // Else if the index of the active exercise is smaller than de index of the last exercise in the exercises array got to next exercise
    else if (this.activeExerciseIndex < this.exercises.length - 1) {
      this.activeExerciseIndex++;
      this.activeExercise = this.exercises[this.activeExerciseIndex];
      this.activeSetIndex = 0;
      this.activeSet = this.activeExercise.sets[this.activeSetIndex];
    }
    // Else workout is complete
    else {
      await this.dbService.updateWorkout(this.id, this.title, this.exercises, true);
      this.pauseTimer();
      const completeModal = await this.modalController.create({
        component: CompletePage,
        animated: true,
        backdropDismiss: false,
        componentProps: {
          time: this.timer,
          exercisesDone: this.exercises.length
        }
      });
      await completeModal.present();
      const dismiss = await completeModal.onDidDismiss();
      if (dismiss) {
        await this.modalController.dismiss();
      }
    }
  }

  goToSet(set: Set) {
    if (set.complete === true){
      this.activeSet = set;
      this.activeSetIndex = set.nr - 1;
    }
  }
}
