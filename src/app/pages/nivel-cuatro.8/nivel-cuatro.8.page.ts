import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nivel-cuatro-8',
  templateUrl: './nivel-cuatro.8.page.html',
  styleUrls: ['./nivel-cuatro.8.page.scss'],
})
export class NivelCuatro8Page {
  public progress = 0;
  private totalLevels = 8;
  private correctAnswers = 0;
  public userAnswer: string = ''; // Respuesta del usuario

  constructor(private router: Router, private alertController: AlertController) {}

  ngOnInit() {
    const storedProgress = localStorage.getItem('progress');
    if (storedProgress) {
      this.progress = parseFloat(storedProgress);
      this.correctAnswers = Math.floor(this.progress * this.totalLevels);
    }
  }

  async checkAnswer() {
    const correctAnswer = 'gato'; // Respuesta correcta para este nivel

    // Verifica si el campo de respuesta está vacío
    if (this.userAnswer.trim() === '') {
      await this.showAlert('Campo Vacío', 'Por favor, escribe una respuesta antes de enviar.');
      return;
    }

    if (this.userAnswer.trim().toLowerCase() === correctAnswer) {
      this.handleCorrectAnswer();
    } else {
      await this.showAlert('Respuesta Incorrecta', 'Inténtalo de nuevo.');
    }
  }

  async handleCorrectAnswer() {
    const alert = await this.alertController.create({
      header: '¡Correcto!',
      message: '¡Bien hecho! Has respondido correctamente.',
      buttons: [{
        text: 'Finalizar',
        handler: () => {
          this.correctAnswers++;
          this.progress = this.correctAnswers / this.totalLevels;

          localStorage.setItem('progress', this.progress.toString());

          if (this.correctAnswers >= this.totalLevels) {
            this.correctAnswers = 0;
            this.progress = 0;

            localStorage.setItem('progress', this.progress.toString());

            this.alertController.create({
              header: '¡Felicidades!',
              message: '¡Has completado todos los niveles del nivel cuatro!',
              buttons: ['OK']
            }).then(alertFinal => alertFinal.present());
            this.router.navigate(['/home']); // Cambia a la pantalla de inicio
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
