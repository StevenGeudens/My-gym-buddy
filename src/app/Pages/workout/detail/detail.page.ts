import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';
import { Exercise } from 'src/app/types/workout-types/exercise';
import { TrainingPage } from './training/training.page';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit, OnDestroy {
  id: string;
  title: string;
  exercises: Exercise[] = [];
  private workoutSubscription: Subscription;

  constructor(
    private dbService: DatabaseService,
    public activatedRoute: ActivatedRoute,
    public modalController: ModalController
    ) { }

  ngOnInit() {
    this.setData();
  }

  ngOnDestroy() {
    if (this.workoutSubscription){
      this.workoutSubscription.unsubscribe();
    }
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

  async startWorkout(): Promise<void> {
      const modal = await this.modalController.create({
        component: TrainingPage,
        animated: true,
        backdropDismiss: false,
        componentProps: {
          id: this.id,
          title: this.title,
          exercises: this.exercises
        }
      });
      await modal.present();
  }

}
