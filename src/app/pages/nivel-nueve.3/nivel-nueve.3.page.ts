import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nivel-nueve-3',
  templateUrl: './nivel-nueve.3.page.html',
  styleUrls: ['./nivel-nueve.3.page.scss'],
})
export class NivelNueve3Page {
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
    const correctAnswer = 'respuesta3'; // Cambia esto a la respuesta correcta
    
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
        text: 'Continuar',
        handler: () => {
          this.correctAnswers++;
          this.progress = this.correctAnswers / this.totalLevels;
          localStorage.setItem('progress', this.progress.toString());
          this.router.navigate(['/nivel-nueve.4']);
          
          if (this.correctAnswers >= this.totalLevels) {
            this.correctAnswers = 0;
            this.progress = 0;
            localStorage.setItem('progress', this.progress.toString());
            this.alertController.create({
              header: '¡Felicidades!',
              message: '¡Has completado el nivel nueve!',
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
