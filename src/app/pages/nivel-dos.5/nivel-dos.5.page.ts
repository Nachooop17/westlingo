import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nivel-dos-5',
  templateUrl: './nivel-dos.5.page.html',
  styleUrls: ['./nivel-dos.5.page.scss'],
})
export class NivelDos5Page {
  public progress = 0;
  private totalLevels = 8;
  private correctAnswers = 0;
  public respuestaVerdadero: boolean = false; // Inicializa el checkbox de Verdadero
  public respuestaFalso: boolean = false; // Inicializa el checkbox de Falso

  constructor(private router: Router, private alertController: AlertController) {}

  ngOnInit() {
    const storedProgress = localStorage.getItem('progress');
    if (storedProgress) {
      this.progress = parseFloat(storedProgress);
      this.correctAnswers = Math.floor(this.progress * this.totalLevels);
    }
  }

  async checkAnswer() {
    const respuestaCorrecta = false; // LA RESPUESTA CORRECTA ES FALSO

    if (this.respuestaVerdadero && this.respuestaFalso) {
      // Ambas opciones están seleccionadas
      await this.showAlert('Selección Inválida', 'Por favor, selecciona solo una opción: Verdadero o Falso.');
    } else if (this.respuestaFalso) {
      // El usuario ha seleccionado Falso
      this.handleCorrectAnswer();
    } else if (this.respuestaVerdadero) {
      // El usuario ha seleccionado Verdadero
      await this.showAlert('Respuesta Incorrecta', 'Lo siento, esa no es la respuesta correcta. Inténtalo de nuevo.');
    } else {
      await this.showAlert('Selección Incompleta', 'Por favor, selecciona una opción: Verdadero o Falso.');
    }
  }

  async handleCorrectAnswer() {
    const alert = await this.alertController.create({
      header: '¡Correcto!',
      message: 'La respuesta es correcta, significa "Frase".',
      buttons: [{
        text: 'Continuar',
        handler: () => {
          this.correctAnswers++;
          this.progress = this.correctAnswers / this.totalLevels;

          localStorage.setItem('progress', this.progress.toString());
          this.router.navigate(['/nivel-dos.6']); // Cambia a nivel 6

          if (this.correctAnswers >= this.totalLevels) {
            this.correctAnswers = 0;
            this.progress = 0;

            localStorage.setItem('progress', this.progress.toString());

            this.alertController.create({
              header: '¡Felicidades!',
              message: '¡Has completado el nivel dos!',
              buttons: ['OK']
            }).then(alertFinal => alertFinal.present());
            this.router.navigate(['/home']);
          }
        }
      }]
    });

    await alert.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}