import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form!: FormGroup;

  constructor(private router: Router,
    private toastController: ToastController,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
  }

  login(ev: any) {
    if (ev) {
      this.router.navigate(['home']);
    } else {
      this.toastController.create({
        message: 'Usuario o contraseña incorrectos',
        duration: 3000,
        position: 'top',
        color: 'danger'
      }).then(toast => toast.present());
    }
  }
}
