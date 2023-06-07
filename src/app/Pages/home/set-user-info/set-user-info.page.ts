import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-set-user-info',
  templateUrl: './set-user-info.page.html',
  styleUrls: ['./set-user-info.page.scss'],
})
export class SetUserInfoPage implements OnInit {
  weight: number;
  height: number;
  calorieTarget: number;

  constructor(private modalController: ModalController, private dbService: DatabaseService) { }

  ngOnInit() {
  }

  async save(): Promise<void> {
    await this.dbService.saveUserInfo(this.weight, this.height, this.calorieTarget);
    await this.modalController.dismiss();
  }

}
