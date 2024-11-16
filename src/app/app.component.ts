import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public hideMenu: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.checkRoute();
    });
  }

  // Método para verificar si la ruta actual es una ruta de login, registro o recuperación
  checkRoute() {
    const currentRoute = this.router.url;

    // Rutas que no deben mostrar el menú
    const forbiddenRoutes = ['/login', '/register', '/recuperar'];

    // Si estamos en alguna de las rutas prohibidas, ocultamos el menú
    if (forbiddenRoutes.includes(currentRoute)) {
      this.hideMenu = true;
    } else {
      // En cualquier otra página, mostramos el menú
      this.hideMenu = false;
    }
  }

  onLogout() {
    // Lógica para cerrar sesión, redirige al login o página de inicio
    this.router.navigate(['/login']);
  }
}
