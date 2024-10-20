import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nivel-ocho-2',
  templateUrl: './nivel-ocho.2.page.html',
  styleUrls: ['./nivel-ocho.2.page.scss'],
})
export class NivelOcho2Page {
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
    this.router.navigate(['/nivel-ocho.3']);
    if (this.correctAnswers >= this.totalLevels) {
      this.correctAnswers = 0;
      this.progress = 0;
      localStorage.setItem('progress', this.progress.toString());
      const alert = await this.alertController.create({
        header: '¡Felicidades!',
        message: '¡Has completado el nivel ocho!',
        buttons: ['OK']
      });
      await alert.present();
      this.router.navigate(['/home']);
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
