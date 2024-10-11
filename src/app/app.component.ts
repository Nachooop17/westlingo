import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  hideMenu: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.hideMenu = event.url === '/login' || event.url === '/register' || event.url === '/recuperar';
      }
    });
  }

  onLogout() {
    // Limpia el localStorage
    localStorage.removeItem('user'); // Si usas almacenamiento local
    sessionStorage.removeItem('user'); // Si usas almacenamiento de sesión

    // Redirige a la página de inicio de sesión
    this.router.navigate(['/login']);
  }
}
