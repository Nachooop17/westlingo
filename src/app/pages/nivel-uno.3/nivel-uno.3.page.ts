import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from '@services/database.service'; // Importar UserService
import { Subnivel } from '@services/subniveles'; // Importar Subnivel

@Component({
  selector: 'app-nivel-uno-3',
  templateUrl: './nivel-uno.3.page.html',
  styleUrls: ['./nivel-uno.3.page.scss'],
})
export class NivelUno3Page implements OnInit {
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
      return; // Asegúrate de que el flujo de control no continúe
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
        // Desbloquear el siguiente nivel si has completado todos los subniveles
        await this.userService.desbloquearSiguienteNivel(this.idusuario, this.idnivel);
  
        const alert = await this.alertController.create({
          header: '¡Felicidades!',
          message: '¡Has completado el nivel tres!',
          buttons: ['OK']
        });
        await alert.present();
        this.router.navigate(['/home']);
      } else {
        // Navegar al siguiente subnivel si aún no has completado todos
        const nextSubnivel = `nivel-uno.${this.correctAnswers + 1}`;
        this.router.navigate([`/${nextSubnivel}`]);
      }
    } else {
      // Si el subnivel ya está completado o es inválido, no hacer nada
      console.log('Este subnivel ya fue completado o no es válido.');
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
