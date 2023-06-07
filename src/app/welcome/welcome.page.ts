import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
import { RegisterPage } from '../register/register.page';
import { AuthService } from '../services/auth.service';
import {StatusBar, Style} from '@capacitor/status-bar';
import {Capacitor} from '@capacitor/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor(public modalController: ModalController, public authService: AuthService, private toastController: ToastController) { }

  ngOnInit() {
    if (Capacitor.isNativePlatform()){
      this.setStatusBar();
    }
  }

  async setStatusBar(): Promise<void> {
    await StatusBar.setBackgroundColor({color: '#eb3d4e'});
    await StatusBar.setStyle({style: Style.Dark});
  }

  async login(): Promise<void> {
    const modal = await this.modalController.create({
      component: LoginPage,
      animated: true,
      backdropDismiss: false,
      cssClass: 'login-modal'
    });
    return await modal.present();
  }

  async register(): Promise<void> {
    const modal = await this.modalController.create({
      component: RegisterPage,
      animated: true,
      backdropDismiss: false,
      cssClass: 'register-modal'
    });
    return await modal.present();
  }

  async signInWithGoogle(): Promise<void> {
    await this.authService.signInWithGoogle().catch((error) => {
      this.createToast(this.authService.convertAuthErrorMessage(error.code)).then(toast => toast.present());
    });
  }

  async signInWithGithub(): Promise<void> {
    await this.authService.signInWithGithub().catch((error) => {
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
