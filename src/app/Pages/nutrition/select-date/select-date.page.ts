import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.page.html',
  styleUrls: ['./select-date.page.scss'],
})
export class SelectDatePage implements OnInit {
  selectedDate: string;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  async dismiss(): Promise<void> {
    await this.modalController.dismiss();
  }

  async setDate(): Promise<void> {
    await this.modalController.dismiss({date: this.selectedDate});
  }

}
