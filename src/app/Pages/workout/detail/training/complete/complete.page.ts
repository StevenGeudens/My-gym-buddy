import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.page.html',
  styleUrls: ['./complete.page.scss'],
})
export class CompletePage implements OnInit {
  time: string;
  exercisesDone: number;

  constructor(
    public modalController: ModalController,
    public router: Router
    ) { }

  ngOnInit() {
  }

  async close(): Promise<void> {
    await this.modalController.dismiss();
  }

  async complete(): Promise<void> {
    await this.modalController.dismiss();
    await this.router.navigate(['tabs', 'workout']);
  }

}
