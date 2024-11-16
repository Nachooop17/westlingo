 import { Component, OnInit } from '@angular/core';

import { AlertController, NavController } from '@ionic/angular';
import { UserService } from '@services/database.service';  // Asegúrate de tener un servicio para gestionar el usuario

@Component({
  selector: 'app-cambioclave',
  templateUrl: './cambioclave.page.html',
  styleUrls: ['./cambioclave.page.scss'],
})
export class CambioclavePage implements OnInit {

  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';

  constructor(
    private alertController: AlertController,
    private userService: UserService,
    private navController: NavController
  ) { }

  ngOnInit() {}

  async onChangePassword() {
    // Verifica que todos los campos sean válidos
    if (!this.currentPassword || !this.newPassword || !this.confirmNewPassword) {
      this.showAlert('Error', 'Todos los campos son obligatorios');
      return;
    }

    // Verifica que la nueva contraseña tenga el formato adecuado
    if (!this.isValidPassword(this.newPassword)) {
      this.showAlert('Error', 'La nueva contraseña debe tener entre 4 y 10 caracteres, incluir una letra mayúscula, un número y un símbolo');
      return;
    }

    // Verifica si las contraseñas coinciden
    if (this.newPassword !== this.confirmNewPassword) {
      this.showAlert('Error', 'Las contraseñas no coinciden');
      return;
    }

    // Intenta cambiar la contraseña
    try {
      const success = await this.userService.changePassword(this.currentPassword, this.newPassword);
      if (success) {
        this.showAlert('Éxito', 'Contraseña cambiada correctamente');
        this.navController.navigateBack('/profile');  // Redirige al perfil o donde quieras
      } else {
        this.showAlert('Error', 'No se pudo cambiar la contraseña');
      }
    } catch (error) {
      this.showAlert('Error', 'Error al cambiar la contraseña');
    }
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
