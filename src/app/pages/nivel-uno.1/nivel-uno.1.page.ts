import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nivel-uno-1',
  templateUrl: './nivel-uno.1.page.html',
  styleUrls: ['./nivel-uno.1.page.scss'],
})
export class NivelUno1Page {
  public progress = 0;
  private totalLevels = 8;
  private correctAnswers = 0;

  constructor(private router: Router, private alertController: AlertController) {}

  ngOnInit() {
    // Recuperar progreso almacenado al iniciar la página
    const storedProgress = localStorage.getItem('progress');
    if (storedProgress) {
      this.progress = parseFloat(storedProgress);
      this.correctAnswers = Math.floor(this.progress * this.totalLevels);
    }
  }

  async handleCorrectAnswer() {
    this.correctAnswers++;
    this.progress = this.correctAnswers / this.totalLevels;

    // Guardar progreso en localStorage
    localStorage.setItem('progress', this.progress.toString());
    this.router.navigate(['/nivel-uno.2']);

    if (this.correctAnswers >= this.totalLevels) {
      this.correctAnswers = 0; // Reiniciar el contador de respuestas correctas
      this.progress = 0; // Reiniciar la barra de progreso

      // Guardar el progreso reiniciado
      localStorage.setItem('progress', this.progress.toString());

      const alert = await this.alertController.create({
        header: '¡Felicidades!',
        message: '¡Has completado el nivel uno!',
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
