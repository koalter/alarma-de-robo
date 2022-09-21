import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { UsuarioService } from '../shared/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  clave: string;
  spinner: HTMLIonLoadingElement;

  constructor(private usuarioService: UsuarioService,
              private router: Router,
              private toastController: ToastController,
              private loadingController: LoadingController) { }

  ngOnInit() {
    this.loadingController.create({
      message: 'Iniciando sesión...'
    }).then(res => this.spinner = res);
  }

  limpiarCampos() {
    this.email = '';
    this.clave = '';
  }
  
  llenarCampos(mail: string, clave: string) {
    this.email = mail;
    this.clave = clave;
  }

  async iniciarSesion() {
    await this.spinner.present();
    try {
      await this.usuarioService.iniciarSesion(this.email, this.clave);
      this.limpiarCampos();
      this.router.navigate(['home']);
      
    } catch (error) {
      const alert = await this.toastController.create({
        header: 'Error al iniciar sesión!',
        duration: 2000,
        position: 'top',
        color: 'danger',
        icon: 'information-circle'
      });
      
      await alert.present();
  
    } finally {
      await this.spinner.dismiss();
    }
  }

  async registrarse() {
    await this.spinner.present();
    try {
      await this.usuarioService.crearUsuario(this.email, this.clave);
      this.limpiarCampos();
      this.router.navigate(['home']);
      
    } catch (error) {
      const alert = await this.toastController.create({
        header: 'Error de registro',
        duration: 2000,
        position: 'top',
        color: 'danger',
        icon: 'information-circle'
      });
      
      await alert.present();
      
    } finally {
      await this.spinner.dismiss();
    }
  }

}
