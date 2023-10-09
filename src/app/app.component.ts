import { Component, OnInit } from '@angular/core';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private platform: Platform) {}

  ngOnInit(): void {
    this.platform.ready().then(() => {
      ScreenOrientation.lock({
        orientation: 'portrait'
      });
      SplashScreen.hide();
    });
  }
}
