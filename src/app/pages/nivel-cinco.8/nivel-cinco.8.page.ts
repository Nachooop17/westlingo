import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nivel-cinco-8',
  templateUrl: './nivel-cinco.8.page.html',
  styleUrls: ['./nivel-cinco.8.page.scss'],
})
export class NivelCinco8Page {
  public progress = 0;
  private totalLevels = 8;
  private correctAnswers = 0;

  constructor(private router: Router, private alertController: AlertController) {}

  ngOnInit() {
    const storedProgress = localStorage.getItem('progress');
    if (storedProgress) {
      this.progress = parseFloat(storedProgress);
      this.correctAnswers = Math.floor(this.progress * this.totalLevels);
    }
  }

  async handleCorrectAnswer() {
    this.correctAnswers++;
    this.progress = this.correctAnswers / this.totalLevels;

    localStorage.setItem('progress', this.progress.toString());

    // Finaliza el nivel cinco
    if (this.correctAnswers >= this.totalLevels) {
      this.correctAnswers = 0; // Reiniciar el contador de respuestas correctas
      this.progress = 0; // Reiniciar la barra de progreso

      localStorage.setItem('progress', this.progress.toString());

      const alert = await this.alertController.create({
        header: '¡Felicidades!',
        message: '¡Has completado el nivel cinco! 🎉',
        buttons: ['OK']
      });
      await alert.present();
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/home']); // Si no es el final, redirigir a la página principal
    }
  }

  async handleIncorrectAnswer() {
    const alert = await this.alertController.create({
      header: 'Respuesta Incorrecta',
      message: 'Lo siento, esa no es la respuesta correcta. Inténtalo de nuevo.',
      buttons: ['OK']
    });
    await alert.present();
  }
}
