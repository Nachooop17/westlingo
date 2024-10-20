import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from '@services/database.service'; // Importar UserService
import { Subnivel } from '@services/subniveles'; // Importar Subnivel
import { Nivel } from '@services/niveles';

@Component({
  selector: 'app-nivel-uno-8',
  templateUrl: './nivel-uno.8.page.html',
  styleUrls: ['./nivel-uno.8.page.scss'],
})
export class NivelUno8Page implements OnInit {
  public progress = 0;
  private totalLevels = 8;
  private correctAnswers = 0;
  private idusuario: number = 0;
  public subniveles: Subnivel[] = []; // Almacenar subniveles
  private idnivel = 1; // Nivel actual
  niveles: Nivel[] = [];

  

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
  
    // Recuperar el progreso almacenado al iniciar la página
    this.userService.getProgreso(this.idusuario).then(progresos => {
      const progresoNivel = progresos.filter(p => p.idnivel === this.idnivel);
  
      if (progresoNivel.length > 0) {
        // Contar los subniveles completados
        const completados = progresoNivel.filter(p => p.completado).length;
        this.correctAnswers = completados;
        this.progress = (this.correctAnswers / this.totalLevels); // Debe estar entre 0 y 1
        console.log(`Progreso cargado: ${this.progress}`);
      } else {
        console.log('No se ha encontrado progreso para este nivel');
      }
    });
  }
  
  async handleCorrectAnswer(idsubnivel: number) {
    const subnivel = this.subniveles.find(s => s.idsubnivel === idsubnivel);
  
    if (subnivel && !subnivel.completado) {
      this.correctAnswers++;
      this.progress = this.correctAnswers / this.totalLevels;
  
      console.log(`Respuesta correcta: ${this.correctAnswers}/${this.totalLevels}, Progreso: ${this.progress}`);
  
      await this.userService.actualizarProgresoSubnivel(this.idusuario, this.idnivel, idsubnivel, true);
      await this.userService.actualizarProgresoNivel(this.idusuario, this.idnivel, this.progress, this.correctAnswers === this.totalLevels);
  
      if (this.correctAnswers >= this.totalLevels) {
        // El usuario ha completado todos los subniveles del nivel
        try {
          console.log(`ID del nivel actual antes del incremento: ${this.idnivel}`);
          const siguienteNivel = this.idnivel + 1; // Identificar el siguiente nivel
  
          await this.userService.actualizarAccesoNivel(siguienteNivel); // Desbloquear el siguiente nivel
          console.log(`Nivel ${siguienteNivel} desbloqueado para el usuario ${this.idusuario}.`);
  
          const alert = await this.alertController.create({
            header: '¡Felicidades!',
            message: `¡Has completado el nivel ${this.idnivel}!`,
            buttons: ['OK']
          });
          await alert.present();
          this.router.navigate(['/home']);
  
          // Después de la actualización y confirmación, ahora incrementar el idnivel
          this.idnivel++;
        } catch (error) {
          console.error('Error al actualizar el acceso al siguiente nivel:', error);
        }
  
        // Actualizar y recargar los niveles después de actualizar el acceso
        this.niveles = await this.userService.getNiveles(this.idusuario);
      } else {
        const nextSubnivel = `nivel-uno.${this.correctAnswers + 1}`;
        this.router.navigate([`/${nextSubnivel}`]);
      }
    } else {
      console.log('Este subnivel ya está completado.');
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
