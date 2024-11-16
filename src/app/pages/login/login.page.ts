import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@services/database.service';
import { AlertController } from '@ionic/angular';
import { Usuario } from '@services/users';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginData = {
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private userService: UserService,
    private alertController: AlertController
  ) {}

  async onLogin() {
    // Verifica si las credenciales son las del administrador
    if (this.loginData.email === 'admin@admin.com' && this.loginData.password === 'admin') {
      // Redirige directamente a la página de administración
      this.router.navigate(['/admin']);
      return;
    }

    // Llama a la función que verifica las credenciales
    const usuario = await this.userService.verificarUsuario(this.loginData.email, this.loginData.password);

    if (usuario) {
      // Verifica si el usuario está baneado
      if (usuario.baneo) {
        await this.showAlert(
          'Acceso denegado',
          `Has sido baneado. Razón: ${usuario.razon || 'No especificada'}`
        );
        return; // Detiene el proceso de inicio de sesión
      }

      // Guardar el ID del usuario en localStorage
      localStorage.setItem('userId', usuario.idusuario.toString());

      // Redirige a la página principal
      this.router.navigate(['/home']);
    } else {
      // Muestra un mensaje de error si las credenciales no son válidas
      this.showAlert('Error', 'Credenciales inválidas');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
