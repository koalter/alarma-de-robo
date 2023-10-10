import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { CapacitorFlash } from '@capgo/capacitor-flash';
import { Haptics } from '@capacitor/haptics';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  isActive: boolean = false;
  trigger: boolean = false;
  x: any;
  y: any;
  z: any;

  alarmType: 'left' | 'right' | 'vertical' | 'horizontal' | undefined;

  constructor(
    private auth: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const accelerometer = (navigator as any).accelerometer;
    accelerometer.watchAcceleration(
      (acceleration: any) => {
        this.x = (acceleration.x as number).toFixed(0);
        this.y = (acceleration.y as number).toFixed(0);
        this.z = (acceleration.z as number).toFixed(0);

        if (this.isActive && this.z == 10 && (this.x == 0 || this.y == 0)) {
          this.trigger = true;
        }

        this.handleAlarm();
      },
      () => {
        console.log("error on accelerometer");
      },
      {
        frequency: 500
      }
    );
  }

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
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: async (data) => {
            if (await this.auth.login(this.auth.user!.email!, data.password)) {
              this.resetAlarm();
              return true;
            } else {
              this.toastController.create({
                message: 'Contraseña incorrecta',
                duration: 2000,
                position: 'top',
                color: 'danger'
              }).then(toast => toast.present());
              Haptics.vibrate({ duration: 5000 });
              CapacitorFlash.switchOn({ intensity: 1 })
                .then(() => {
                  setTimeout(() => CapacitorFlash.switchOff(), 5000);
                });
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

  handleAlarm() {
    if (this.trigger) {
      if (this.z != 10) {
        if (this.x < -2 && this.alarmType !== 'right') {
          this.alarmType = 'right';
        } else if (this.x > 2 && this.alarmType !== 'left') {
          this.alarmType = 'left';
        } else if ((this.y < -2 || this.y > 2) && this.alarmType !== 'vertical') {
          this.alarmType = 'vertical';
          CapacitorFlash.switchOn({ intensity: 1 })
            .then(() => {
              setTimeout(() => CapacitorFlash.switchOff(), 5000);
            });
        } 
      } else {
        if (this.alarmType == 'left' || this.alarmType == 'right' || this.alarmType == 'vertical') {
          this.alarmType = 'horizontal';
          Haptics.vibrate({ duration: 5000 });
        }
      }
    }
  }

  resetAlarm() {
    this.trigger = false;
    this.alarmType = undefined;
    CapacitorFlash.isSwitchedOn().then(result => {
      if (result.value) {
        CapacitorFlash.switchOff();
      }
    })
  }
}
