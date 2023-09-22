import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  showSplashScreen: boolean = true;

  constructor() {}

  ngOnInit(): void {
    setInterval(() => {
      this.showSplashScreen = false;
    }, 3000);
  }
}
