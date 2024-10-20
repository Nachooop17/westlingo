import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nivel-seis-8',
  templateUrl: './nivel-seis.8.page.html',
  styleUrls: ['./nivel-seis.8.page.scss'],
})
export class NivelSeis8Page {
  public progress = 0;
  private totalLevels = 8;
  private correctAnswers = 0;
  public respuestaVerdadero: boolean = false;
  public respuestaFalso: boolean = false;

  constructor(private router: Router, private alertController: AlertController) {}

  ngOnInit() {
    const storedProgress = localStorage.getItem('progress');
    if (storedProgress) {
      this.progress = parseFloat(storedProgress);
      this.correctAnswers = Math.floor(this.progress * this.totalLevels);
    }
  }

  async checkAnswer() {
    const respuestaCorrecta = true; // La respuesta correcta es Verdadero
    if (this.respuestaVerdadero && this.respuestaFalso) {
      await this.showAlert('Selección Inválida', 'Por favor, selecciona solo una opción: Verdadero o Falso.');
    } else if (this.respuestaVerdadero) {
      this.handleCorrectAnswer();
    } else if (this.respuestaFalso) {
      await this.showAlert('Respuesta Incorrecta', 'Lo siento, esa no es la respuesta correcta. Inténtalo de nuevo.');
    } else {
      await this.showAlert('Selección Incompleta', 'Por favor, selecciona una opción: Verdadero o Falso.');
    }
  }

  async handleCorrectAnswer() {
    const alert = await this.alertController.create({
      header: '¡Correcto!',
      message: 'La respuesta es correcta, significa "Casi nunca".',
      buttons: [{
        text: 'Continuar',
        handler: () => {
          this.correctAnswers++;
          this.progress = this.correctAnswers / this.totalLevels;
          localStorage.setItem('progress', this.progress.toString());
          this.router.navigate(['/home']);
          this.alertController.create({
            header: '¡Felicidades!',
            message: '¡Has completado el nivel seis!',
            buttons: ['OK']
          }).then(alertFinal => alertFinal.present());
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
