import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { CapacitorFlash } from '@capgo/capacitor-flash';
import { Haptics } from '@capacitor/haptics';
import { NativeAudio } from '@capacitor-community/native-audio';
import { Logger } from '../services/logger.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  isActive: boolean = false;
  trigger: boolean = false;
  alarmType: 'left' | 'right' | 'vertical' | 'horizontal' | undefined;

  constructor(
    private auth: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController,
    private platform: Platform,
    private logger: Logger
  ) {}

  ngOnInit() {
    const accelerometer = (navigator as any).accelerometer;
    try {
      this.loadSounds();
      accelerometer.watchAcceleration(
        (acceleration: any) => {
          const x = parseInt((acceleration.x as number).toFixed(0));
          const y = parseInt((acceleration.y as number).toFixed(0));
          const z = parseInt((acceleration.z as number).toFixed(0));
  
          if (this.isActive && z == 10 && (x == 0 || y == 0)) {
            this.trigger = true;
          }
  
          this.handleAlarm(x, y, z);
        },
        () => {
          console.log("error on accelerometer");
        },
        {
          frequency: 500
        }
      );
    } catch (e: any) {
      this.logger.logError(e);
    }
  }

  async loadSounds() {
    await NativeAudio.preload({
      assetPath: 'public/assets/sounds/alarm_left.mp3',
      assetId: 'left'
    });
    await NativeAudio.preload({
      assetPath: 'public/assets/sounds/alarm_right.mp3',
      assetId: 'right'
    });
    await NativeAudio.preload({
      assetPath: 'public/assets/sounds/alarm_vertical.mp3',
      assetId: 'vertical'
    });
    await NativeAudio.preload({
      assetPath: 'public/assets/sounds/alarm_horizontal.mp3',
      assetId: 'horizontal'
    });
    await NativeAudio.preload({
      assetPath: 'public/assets/sounds/alarm_fail.mp3',
      assetId: 'fail'
    });
  }

  async logout() {
    if (await this.promptCredentials()) {
      const loadingElement = await this.loadingController
        .create({ message: 'Cerrando sesión...' });
        
      await loadingElement.present();
      const result = await this.auth.logout();
      await loadingElement.dismiss();
  
      if (result) {
        this.resetAlarm();
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
      translucent: true,
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
              NativeAudio.play({ assetId: 'fail' })
                .then(() => {
                  setTimeout(() => NativeAudio.stop({ assetId: 'fail' }), 5000);
                })
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

  handleAlarm(x: number, y: number, z: number) {
    if (this.trigger) {
      if (z != 10) {
        if (x < -2 && this.alarmType !== 'right') {
          this.alarmType = 'right';
          NativeAudio.play({ assetId: 'right' })
            .then(() => setInterval(() => NativeAudio.stop({ assetId: 'right' }), 5000));
        } else if (x > 2 && this.alarmType !== 'left') {
          this.alarmType = 'left';
          NativeAudio.play({ assetId: 'left' });
        } else if ((y < -2 || y > 2) && this.alarmType !== 'vertical') {
          this.alarmType = 'vertical';
          NativeAudio.play({ assetId: 'vertical' })
            .then(() => {
              setTimeout(() => NativeAudio.stop({ assetId: 'vertical' }), 5000);
            });
          CapacitorFlash.switchOn({ intensity: 1 })
            .then(() => {
              setTimeout(() => CapacitorFlash.switchOff(), 5000);
            });
        } 
      } else {
        if (this.alarmType == 'left' || this.alarmType == 'right' || this.alarmType == 'vertical') {
          this.alarmType = 'horizontal';
          NativeAudio.play({ assetId: 'horizontal' })
            .then(() => setTimeout(() => NativeAudio.stop({ assetId: 'horizontal' }), 5000));
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
    });
    if (this.alarmType) {
      NativeAudio.stop({ assetId: this.alarmType });
    }
  }
}
