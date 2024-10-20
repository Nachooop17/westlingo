import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from '@services/database.service'; // Importar UserService
import { Subnivel } from '@services/subniveles'; // Importar Subnivel

@Component({
  selector: 'app-nivel-uno-4',
  templateUrl: './nivel-uno.4.page.html',
  styleUrls: ['./nivel-uno.4.page.scss'],
})
export class NivelUno4Page implements OnInit {
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
      this.progress = this.correctAnswers / this.totalLevels; // Calcular progreso
  
      console.log(`Respuesta correcta: ${this.correctAnswers}/${this.totalLevels}, Progreso: ${this.progress}`);
  
      // Actualizar progreso en la base de datos
      await this.userService.actualizarProgreso(this.idusuario, this.idnivel, idsubnivel, this.progress, true);
  
      if (this.correctAnswers >= this.totalLevels) {
        // Desbloquear el siguiente nivel si todos los subniveles están completos
        await this.userService.desbloquearSiguienteNivel(this.idusuario, this.idnivel);
  
        const alert = await this.alertController.create({
          header: '¡Felicidades!',
          message: '¡Has completado el nivel uno!',
          buttons: ['OK']
        });
        await alert.present();
        this.router.navigate(['/home']);
      } else {
        // Navegar al siguiente subnivel
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
