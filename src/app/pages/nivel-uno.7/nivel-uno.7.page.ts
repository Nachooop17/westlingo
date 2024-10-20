import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from '@services/database.service'; // Importar UserService
import { Subnivel } from '@services/subniveles'; // Importar Subnivel

@Component({
  selector: 'app-nivel-uno-7',
  templateUrl: './nivel-uno.7.page.html',
  styleUrls: ['./nivel-uno.7.page.scss'],
})
export class NivelUno7Page implements OnInit {
  public progress = 0;
  private totalLevels = 8;
  private correctAnswers = 0;
  private idusuario: number = 0;
  public subniveles: Subnivel[] = []; // Almacenar subniveles
  private idnivel = 1; // Nivel actual

  constructor(
    private router: Router, 
    private alertController: AlertController, 
    private userService: UserService // Inyectar UserService
  ) {}

  ngOnInit() {
    // Recuperar el ID del usuario logeado
    this.idusuario = Number(localStorage.getItem('userId'));
    if (!this.idusuario) {
      alert('No se ha encontrado un usuario logeado');
      this.router.navigate(['/login']);
      return; // Detener el flujo de ejecución
    }

    // Obtener subniveles
    this.userService.getSubniveles(this.idnivel).then(subniveles => {
      this.subniveles = subniveles;
    });

    // Recuperar progreso almacenado al iniciar la página
    this.userService.getProgreso(this.idusuario).then(progresos => {
      const storedProgress = progresos.find(p => p.idnivel === this.idnivel);
      if (storedProgress) {
        this.progress = storedProgress.progreso;
        this.correctAnswers = Math.floor(this.progress * this.totalLevels);
        console.log(`Progreso cargado: ${this.progress}`);
      }
    });
  }

  async handleCorrectAnswer(idsubnivel: number) {
    const subnivel = this.subniveles.find(s => s.idsubnivel === idsubnivel);

    if (subnivel && !subnivel.completado) {
      this.correctAnswers++;
      this.progress = this.correctAnswers / this.totalLevels; // Calcular progreso

      console.log(`Respuesta correcta: ${this.correctAnswers}/${this.totalLevels}, Progreso: ${this.progress}`);

      // Actualizar progreso en la base de datos
      await this.userService.actualizarProgreso(this.idusuario, this.idnivel, idsubnivel, this.progress, true);

      if (this.correctAnswers >= this.totalLevels) {
        // Desbloquear el siguiente nivel si se han completado todos los subniveles
        await this.userService.desbloquearSiguienteNivel(this.idusuario, this.idnivel);

        const alert = await this.alertController.create({
          header: '¡Felicidades!',
          message: '¡Has completado el nivel siete!',
          buttons: ['OK']
        });
        await alert.present();
        this.router.navigate(['/home']);
      } else {
        // Navegar al siguiente subnivel
        const nextSubnivel = `nivel-uno.${this.correctAnswers + 8}`; // Ajustar la navegación
        this.router.navigate([`/${nextSubnivel}`]);
      }
    } else {
      // Navegar al siguiente subnivel si ya está completo
      const nextSubnivel = `nivel-uno.${this.correctAnswers + 8}`; // Ajusta la navegación
      this.router.navigate([`/${nextSubnivel}`]);
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
