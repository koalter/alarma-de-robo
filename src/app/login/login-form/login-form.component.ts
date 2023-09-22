import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  @Output() onSubmit = new EventEmitter();
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private loadingCtrl: LoadingController
  ) {}

  async submit() {
    const loadingElement = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
    });
    if (this.form.valid) {
      await loadingElement.present();
      const result = await this.auth.login(
        this.email.value,
        this.password.value
      );
      await loadingElement.dismiss();
      this.onSubmit.emit(result);
      this.form.reset();
    }
  }

  fill() {
    this.email.setValue('e@e.com');
    this.password.setValue('123456');
  }
}
