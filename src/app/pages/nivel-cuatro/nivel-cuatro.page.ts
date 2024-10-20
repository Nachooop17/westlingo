import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-nivel-cuatro',
  templateUrl: './nivel-cuatro.page.html',
  styleUrls: ['./nivel-cuatro.page.scss'],
})
export class NivelCuatroPage {
  respuestaDada: boolean = false;
  resultadoMensaje: string = '';

  constructor(private alertController: AlertController) {}

  async verificarRespuesta(opcion: string) {
    if (opcion === 'A') {
      this.resultadoMensaje = '¡Correcto! Has saludado correctamente.';
    } else {
      this.resultadoMensaje = 'Incorrecto. La respuesta correcta era A: Hola.';
      await this.mostrarAlerta('Respuesta Incorrecta', 'Intenta de nuevo.');
    }
    this.respuestaDada = true;
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });

    await alert.present();
  }

  reiniciarJuego() {
    this.respuestaDada = false;
    this.resultadoMensaje = '';
  }
}
