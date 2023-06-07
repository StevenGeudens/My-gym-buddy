import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-edit-calorie-target',
  templateUrl: './edit-calorie-target.page.html',
  styleUrls: ['./edit-calorie-target.page.scss'],
})
export class EditCalorieTargetPage implements OnInit {
  calorieTarget: number;

  validationForm: FormGroup;
  validationMessages = {
    calorieTarget: [
      {type: 'required', message: 'Please enter a valid calorie target'}
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.validationForm = this.formBuilder.group({
      calorieTarget: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
    this.validationForm.patchValue({
      calorieTarget: this.calorieTarget
    });
  }

  async update(form: any) {
    await this.modalController.dismiss({calorieTarget: form.calorieTarget});
  }

  async dismiss() {
    await this.modalController.dismiss();
  }

}
