import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnChanges {

  private testUsers = [
    {
      email: 'e@e.com',
      password: '123456'
    },
    {
      email: 'a@a.com',
      password: '123456'
    },
    {
      email: 'i@i.com',
      password: '123456'
    }
  ]

  @Input() userId?: number;
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && this.userId !== undefined) {
      this.fill(this.userId);
    }
  }

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

  fill(index: number) {
    this.email.setValue(this.testUsers[index].email);
    this.password.setValue(this.testUsers[index].password);
  }
}
