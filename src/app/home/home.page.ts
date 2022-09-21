import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../shared/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private usuarioService: UsuarioService,
    private router: Router) {}

  cerrarSesion() {
    this.usuarioService.cerrarSesion().then(res => {
      this.router.navigate(['login']);
    });
  }

}
