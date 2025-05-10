import { Component } from '@angular/core';
import { UserService } from '@services/database.service';
import { AlertController } from '@ionic/angular';

@Component({
    selector: 'app-recuperar',
    templateUrl: './recuperar.page.html',
    styleUrls: ['./recuperar.page.scss'],
    standalone: false
})
export class RecuperarPage {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private userService: UserService, private alertController: AlertController) {}

  async onRecoverPassword() {
    // Verificar que las contraseñas coincidan
    if (this.newPassword !== this.confirmPassword) {
      this.showAlert('Error', 'Las contraseñas no coinciden');
      return;
    }

    // Verificar si el email existe en la base de datos
    const usuarioExiste = await this.userService.verificarEmail(this.email);
    
    if (usuarioExiste) {
      // Actualizar la contraseña
      await this.userService.actualizarPassword(this.email, this.newPassword);
      this.showAlert('Éxito', 'Contraseña actualizada correctamente');
    } else {
      this.showAlert('Error', 'El correo electrónico no existe');
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
