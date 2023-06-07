import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { from, Observable } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';
import { Workout } from 'src/app/types/workout-types/workout';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
})
export class WorkoutPage implements OnInit {
  workoutsObservable: Observable<Workout[]> = from([]);

  constructor(
    public router: Router,
    private dbService: DatabaseService,
    private alertController: AlertController
  ) {
    this.workoutsObservable = dbService.retrieveWorkouts();
  }

  ngOnInit() {
  }

  async navigateToProfilePage(){
    await this.router.navigate(['/profile']);
  }

  async deleteWorkout(id: string): Promise<void> {
    const deleteConfirmAlert = await this.alertController.create({
      header: 'Are you sure?',
      message: 'This workout will be permanently deleted',
      animated: true,
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
      await this.dbService.deleteWorkout(id);
    }
  }

  async swipeEvent($event: any, id: string) {
    if ($event.detail.side == 'start') {
      await this.deleteWorkout(id);
    } else if ($event.detail.side == 'end') {
      await this.router.navigate(['tabs', 'workout', 'workout-builder', id]);
    }
  }

}
