import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nivel-ocho-4',
  templateUrl: './nivel-ocho.4.page.html',
  styleUrls: ['./nivel-ocho.4.page.scss'],
})
export class NivelOcho4Page {
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
      message: 'La respuesta es correcta, significa "(tu texto aquí)".',
      buttons: [{
        text: 'Continuar',
        handler: () => {
          this.correctAnswers++;
          this.progress = this.correctAnswers / this.totalLevels;
          localStorage.setItem('progress', this.progress.toString());
          this.router.navigate(['/nivel-ocho.5']);
          if (this.correctAnswers >= this.totalLevels) {
            this.correctAnswers = 0;
            this.progress = 0;
            localStorage.setItem('progress', this.progress.toString());
            this.alertController.create({
              header: '¡Felicidades!',
              message: '¡Has completado el nivel ocho!',
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