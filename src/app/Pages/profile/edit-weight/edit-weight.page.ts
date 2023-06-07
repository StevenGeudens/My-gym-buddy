import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import { Weight } from '../../../types/user-types/weight';

@Component({
  selector: 'app-edit-weight',
  templateUrl: './edit-weight.page.html',
  styleUrls: ['./edit-weight.page.scss'],
})
export class EditWeightPage implements OnInit {
  weight: Weight;

  validationForm: FormGroup;
  validationMessages = {
    weight: [
      {type: 'required', message: 'Please enter a valid weight'}
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.validationForm = this.formBuilder.group({
      weight: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
    this.validationForm.patchValue({
      weight: this.weight.kg
    });
  }

  async update(form: any) {
    await this.modalController.dismiss({weight: {kg: form.weight, date: this.weight.date}});
  }

  async dismiss() {
    await this.modalController.dismiss();
  }
}
