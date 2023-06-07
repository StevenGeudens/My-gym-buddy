import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-edit-height',
  templateUrl: './edit-height.page.html',
  styleUrls: ['./edit-height.page.scss'],
})
export class EditHeightPage implements OnInit {
  height: number;

  validationForm: FormGroup;
  validationMessages = {
    height: [
      {type: 'required', message: 'Please enter a valid height'}
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.validationForm = this.formBuilder.group({
      height: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
    this.validationForm.patchValue({
      height: this.height
    });
  }

  async update(form: any) {
    await this.modalController.dismiss({height: form.height});
  }

  async dismiss() {
    await this.modalController.dismiss();
  }
}
