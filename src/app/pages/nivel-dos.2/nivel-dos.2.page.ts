import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subnivel } from '@services/subniveles';
import { UserService } from '@services/database.service';
import { Nivel } from '@services/niveles';


@Component({
  selector: 'app-nivel-dos-2',
  templateUrl: './nivel-dos.2.page.html',
  styleUrls: ['./nivel-dos.2.page.scss'],
})
export class NivelDos2Page {
  public progress = 0;
  private totalLevels = 8;
  private correctAnswers = 0;
  private idusuario: number = 0;
  public subniveles: Subnivel[] = []; // Almacenar subniveles
  private idnivel = 2; // Cambiar a nivel 2
  niveles: Nivel[] = [];

  // Agregar las propiedades para las respuestas
  public respuestaVerdadero: boolean = false;
  public respuestaFalso: boolean = false;

  constructor(
    private router: Router, 
    private alertController: AlertController, 
    private userService: UserService // Inyectar UserService
  ) {}

  ngOnInit() {
    // Recuperar el ID del usuario logeado
    const userId = localStorage.getItem('userId');
    console.log('ID Usuario encontrado en localStorage:', userId); // Verificar aquí
  
    if (userId) {
      this.idusuario = Number(userId);
      // Continuar con la obtención de subniveles y progreso...
      // Obtener subniveles
      this.userService.getSubniveles(this.idnivel).then(subniveles => {
        this.subniveles = subniveles;
      });
  
      // Recuperar el progreso almacenado al iniciar la página
      this.userService.getProgreso(this.idusuario).then(progresos => {
        const progresoNivel = progresos.filter(p => p.idnivel === this.idnivel);
        if (progresoNivel.length > 0) {
          const completados = progresoNivel.filter(p => p.completado).length;
          this.correctAnswers = completados;
          this.progress = (this.correctAnswers / this.totalLevels); // Debe estar entre 0 y 1
          console.log(`Progreso cargado: ${this.progress}`);
        } else {
          console.log('No se ha encontrado progreso para este nivel');
        }
      });
    } else {
      console.error('No se ha encontrado el idusuario en localStorage');
      alert('No se ha encontrado un usuario logeado');
      this.router.navigate(['/login']);
      return; // Asegúrate de que el flujo de control no continúe
    }
  }
  
  

  // Método para validar la respuesta
  checkAnswer() {
    console.log(`Verdadero: ${this.respuestaVerdadero}, Falso: ${this.respuestaFalso}`);
    const currentSubnivel = this.correctAnswers + 1; // Cambiar a un subnivel basado en el número de respuestas correctas
    if (this.respuestaVerdadero && !this.respuestaFalso) {
        this.handleCorrectAnswer(currentSubnivel); // Llama a la función con el subnivel correspondiente
    } else {
        this.handleIncorrectAnswer();
    }
}

  

  async handleCorrectAnswer(idsubnivel: number) {
    // Usar idusuario que se ha establecido en ngOnInit
    if (!this.idusuario) {
        console.error('No se encontró el idusuario');
        return;
    }

    const subnivel = this.subniveles.find(s => s.idsubnivel === idsubnivel);

    if (subnivel && !subnivel.completado) {
        console.log('Subnivel no completado, procesando respuesta correcta...');
        this.correctAnswers++;
        this.progress = this.correctAnswers / this.totalLevels;

        console.log(`Respuesta correcta: ${this.correctAnswers}/${this.totalLevels}, Progreso: ${this.progress}`);

        // Pasar idusuario a las funciones correspondientes
        await this.userService.actualizarProgresoSubnivel(this.idusuario, this.idnivel, idsubnivel, true);
        await this.userService.actualizarProgresoNivel(this.idusuario, this.idnivel, this.progress, this.correctAnswers === this.totalLevels);

        if (this.correctAnswers == this.totalLevels) {
            // El usuario ha completado todos los subniveles del nivel
            try {
                console.log(`ID del nivel actual antes del incremento: ${this.idnivel}`);
                const siguienteNivel = this.idnivel + 1; // Identificar el siguiente nivel

                // Pasar el idusuario al actualizar el acceso del siguiente nivel
                await this.userService.actualizarAccesoNivel(this.idusuario, siguienteNivel);
                console.log(`Nivel ${siguienteNivel} desbloqueado para el usuario ${this.idusuario}.`);
                
                // Otorgar el logro al usuario
                await this.userService.otorgarLogro(this.idusuario, 'Medalla de Bronce', 'Completaste el Nivel 1', new Date(), 'assets/img/medallabronce.png');

                const alert = await this.alertController.create({
                    header: '¡Felicidades!',
                    message: `¡Has completado el nivel ${this.idnivel}!`,
                    buttons: ['OK']
                });
                await alert.present();
                this.router.navigate(['/home']);

                // Incrementar idnivel después de la actualización y confirmación
                this.idnivel++;
            } catch (error) {
                console.error('Error al actualizar el acceso al siguiente nivel:', error);
            }

            // Actualizar y recargar los niveles después de actualizar el acceso
            this.niveles = await this.userService.getNiveles(this.idusuario);
        } else if (this.correctAnswers > this.totalLevels) {
            // Si de alguna manera hay más respuestas correctas de lo que debería
            const alert = await this.alertController.create({
                header: '¡Buen intento!',
                message: `¡Pero ya habías completado el nivel ${this.idnivel}!`,
                buttons: ['OK']
            });
            await alert.present();
            this.router.navigate([`/home`]);
        } else {
            // Navegar al siguiente subnivel
            const nextSubnivel = `nivel-dos.${this.correctAnswers + 1}`;
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
