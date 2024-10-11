import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nivel-tres-8',
  templateUrl: './nivel-tres.8.page.html',
  styleUrls: ['./nivel-tres.8.page.scss'],
})
export class NivelTres8Page {
  public progress = 0;
  private totalLevels = 8;
  private correctAnswers = 0;
  public respuestaDada: boolean = false;
  public resultadoMensaje: string = '';

  constructor(private router: Router, private alertController: AlertController) {}

  ngOnInit() {
    const storedProgress = localStorage.getItem('progress');
    if (storedProgress) {
      this.progress = parseFloat(storedProgress);
      this.correctAnswers = Math.floor(this.progress * this.totalLevels);
    }
  }

  async verificarRespuesta(respuesta: string) {
    const respuestaCorrecta = 'B'; // Cambia esto a la respuesta correcta

    this.respuestaDada = true;

    if (respuesta === respuestaCorrecta) {
      this.resultadoMensaje = '¡Correcto! Has solicitado ayuda correctamente.';
      await this.handleCorrectAnswer();
    } else {
      this.resultadoMensaje = 'Incorrecto. Inténtalo de nuevo.';
      await this.showIncorrectAlert();
    }
  }

  async showIncorrectAlert() {
    const alert = await this.alertController.create({
      header: 'Respuesta Incorrecta',
      message: 'Lo siento, esa no es la respuesta correcta. Inténtalo de nuevo.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async handleCorrectAnswer() {
    const alert = await this.alertController.create({
      header: '¡Correcto!',
      message: '¡Has respondido bien!',
      buttons: [{
        text: 'Continuar',
        handler: () => {
          this.correctAnswers++;
          this.progress = this.correctAnswers / this.totalLevels;
          localStorage.setItem('progress', this.progress.toString());

          // Si es el último nivel
          if (this.correctAnswers >= this.totalLevels) {
            this.alertController.create({
              header: '¡Felicidades!',
              message: '¡Has completado el nivel tres!',
              buttons: ['OK']
            }).then(alertFinal => alertFinal.present());
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/nivel-tres.8']); // Cambia a nivel 8
          }
        }
      }]
    });
    await alert.present();
  }
}
