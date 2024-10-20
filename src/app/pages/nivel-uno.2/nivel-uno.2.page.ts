import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from '@services/database.service';
import { Subnivel } from '@services/subniveles';

@Component({
  selector: 'app-nivel-uno-2',
  templateUrl: './nivel-uno.2.page.html',
  styleUrls: ['./nivel-uno.2.page.scss'],
})
export class NivelUno2Page implements OnInit {
  public progress = 0;
  private totalLevels = 8;
  private correctAnswers = 0;
  private idusuario: number = 0;
  public subniveles: Subnivel[] = [];
  private idnivel = 1;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.idusuario = Number(localStorage.getItem('userId'));
    if (!this.idusuario) {
      alert('No se ha encontrado un usuario logeado');
      this.router.navigate(['/login']);
      return;
    }

    // Obtener subniveles
    this.userService.getSubniveles(this.idnivel).then(subniveles => {
      this.subniveles = subniveles;
    });

    // Recuperar progreso
    this.userService.getProgreso(this.idusuario).then(progresos => {
      const progresoNivel = progresos.filter(p => p.idnivel === this.idnivel);
      if (progresoNivel.length > 0) {
        const completados = progresoNivel.filter(p => p.completado).length;
        this.correctAnswers = completados;
        this.progress = (this.correctAnswers / this.totalLevels);
        console.log(`Progreso cargado: ${this.progress}`);
      }
    });
  }

  async handleCorrectAnswer(idsubnivel: number) {
    const subnivel = this.subniveles.find(s => s.idsubnivel === idsubnivel);
  
    if (subnivel && !subnivel.completado) {
      this.correctAnswers++;
      this.progress = this.correctAnswers / this.totalLevels;
  
      console.log(`Respuesta correcta: ${this.correctAnswers}/${this.totalLevels}, Progreso: ${this.progress}`);
  
      await this.userService.actualizarProgreso(this.idusuario, this.idnivel, idsubnivel, this.progress, true);
  
      if (this.correctAnswers >= this.totalLevels) {
        await this.userService.desbloquearSiguienteNivel(this.idusuario, this.idnivel);
  
        const alert = await this.alertController.create({
          header: '¡Felicidades!',
          message: '¡Has completado el nivel uno!',
          buttons: ['OK']
        });
        await alert.present();
        this.router.navigate(['/home']);
      } else {
        const nextSubnivel = `nivel-uno.${this.correctAnswers + 1}`;
        this.router.navigate([`/${nextSubnivel}`]);
      }
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
