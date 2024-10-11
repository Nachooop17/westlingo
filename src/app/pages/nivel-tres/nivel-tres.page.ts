import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-nivel-tres',
  templateUrl: './nivel-tres.page.html',
  styleUrls: ['./nivel-tres.page.scss'],
})
export class NivelTresPage {
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
