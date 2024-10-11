import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UserService } from '@services/database.service';
import { Usuario } from '@services/users';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  name!: string;
  email!: string;
  password!: string;
  r_password!: string;

  constructor(private alertController: AlertController, private userService: UserService) {}

  async onRegister(form: { valid: any; }) {
    // Verifica si las contraseñas coinciden
    if (this.password !== this.r_password) {
      this.showAlert('Error', 'Las contraseñas no coinciden');
      return;
    }

    // Verifica si todos los campos están llenos
    if (!this.name || !this.email || !this.password || !this.r_password) {
      this.showAlert('Error', 'Todos los campos son obligatorios');
      return;
    }

    // Verifica si el formato del email es válido
    if (!this.isValidEmail(this.email)) {
      this.showAlert('Error', 'El formato del email no es válido');
      return;
    }

    // Verifica si la contraseña es válida
    if (!this.isValidPassword(this.password)) {
      this.showAlert(
        'Error',
        'La contraseña debe tener entre 4 y 10 caracteres, incluir una letra mayúscula, un número y un símbolo'
      );
      return;
    }

    if (form.valid) {
      try {
        await this.userService.insertarUsuario(this.name, this.email, this.password);
        await this.showAlert('Registro exitoso', 'Usuario registrado correctamente');
      } catch (error) {
        await this.showAlert('Error', 'Error al registrar el usuario');
      }
    }
  }

  // Función para validar el formato del email
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
   
  // Función para validar el formato de la contraseña
  isValidPassword(password: string): boolean {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,10}$/;
    return passwordPattern.test(password);
  }

  // Función para mostrar alertas
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
