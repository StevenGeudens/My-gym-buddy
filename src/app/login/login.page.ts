import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  validationForm: FormGroup;
  validationMessages = {
    email: [
      {type: 'required', message: 'Please enter your email'},
      {type: 'pattern', message: 'The email entered is incorrect. Please try again'},
    ],
    password: [
      {type: 'required', message: 'Please enter your password'}
    ]
  };

  constructor(
    public modalController: ModalController,
    public authService: AuthService,
    public formBuilder: FormBuilder,
    private toastController: ToastController) { }

  ngOnInit() {
    this.validationForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
  }

  async dismiss() {
    await this.modalController.dismiss();
  }

  async login(form: any) {
    await this.authService.signInUserWithEmailAndPassword(form.email, form.password).then(async () => {
      await this.modalController.dismiss();
    }).catch((error) => {
      this.createToast(this.authService.convertAuthErrorMessage(error.code)).then(toast => toast.present());
    });
  }

  async createToast(message: string): Promise<HTMLIonToastElement> {
    return await this.toastController.create({
      message,
      duration: 5000,
      position: 'top',
      icon: 'alert-circle-outline',
      cssClass: 'error-toast',
      buttons: [
        {
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    });
  }
}
