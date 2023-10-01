import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertInput, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  isActive: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  async logout() {
    if (await this.promptCredentials()) {
      const loadingElement = await this.loadingController
        .create({ message: 'Cerrando sesión...' });
        
      await loadingElement.present();
      const result = await this.auth.logout();
      await loadingElement.dismiss();
  
      if (result) {
        this.isActive = false;
        this.router.navigate(['login']);
      }
    }
  }

  async promptCredentials() {
    if (!this.isActive) {
      return true;
    }

    const alert = await this.alertController.create({
      header: 'Ingrese contraseña',
      inputs: [
        {
          name: 'password',
          placeholder: 'Contraseña',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: async (data) => {
            if (await this.auth.login(this.auth.user!.email!, data.password)) {
              return true;
            } else {
              this.toastController.create({
                message: 'Contraseña incorrecta',
                duration: 2000,
                position: 'top',
                color: 'danger'
              }).then(toast => toast.present());
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
    return await alert.onDidDismiss();
  }

  async toggleAlarm() {
    if (await this.promptCredentials()) {
      this.isActive = !this.isActive;
  
      this.toastController.create({
        message: this.isActive ? 'La alarma fue activada' : 'La alarma fue desactivada',
        duration: 3000,
        position: 'top',
        color: this.isActive ? 'success' : 'danger'
      }).then(toast => toast.present());
    }
  }
}
