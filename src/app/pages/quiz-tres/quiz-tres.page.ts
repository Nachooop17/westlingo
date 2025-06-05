import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { 
  AlertController, 
  LoadingController, 
  NavController,
  IonicModule 
} from '@ionic/angular'; 
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { GestureDetectionService } from 'src/app/services/gesture-detection.service';
import { User } from '@supabase/supabase-js';

// Definición de los landmarks de MediaPipe Hands (para referencia)
const HandLandmark = {
  WRIST: 0,
  THUMB_CMC: 1, THUMB_MCP: 2, THUMB_IP: 3, THUMB_TIP: 4,
  INDEX_FINGER_MCP: 5, INDEX_FINGER_PIP: 6, INDEX_FINGER_DIP: 7, INDEX_FINGER_TIP: 8,
  MIDDLE_FINGER_MCP: 9, MIDDLE_FINGER_PIP: 10, MIDDLE_FINGER_DIP: 11, MIDDLE_FINGER_TIP: 12,
  RING_FINGER_MCP: 13, RING_FINGER_PIP: 14, RING_FINGER_DIP: 15, RING_FINGER_TIP: 16,
  PINKY_MCP: 17, PINKY_PIP: 18, PINKY_DIP: 19, PINKY_TIP: 20,
};

@Component({
  selector: 'app-quiz-tres',
  templateUrl: './quiz-tres.page.html',
  styleUrls: ['./quiz-tres.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonicModule
  ]
})
export class QuizTresPage implements OnInit, OnDestroy {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;

  levelId: number | null = null;
  subnivelId: number | null = null;
  currentUser: User | null = null;
  currentScore: number = 0;
  quizCompleted: boolean = false;

  // --- Propiedades para Detección de Gestos ---
  gestureDetected: string = '';
  llmFeedback: string = ''; // Retroalimentación para el usuario

  // Umbrales para la detección del estado de los dedos (ajustar según sea necesario)
  private readonly UMBRAL_Y_DEDO = 0.03; // Para verificar si la punta está por encima/debajo de MCP/PIP
  private readonly UMBRAL_Y_PULGAR = 0.02; 
  private readonly UMBRAL_X_PULGAR_DESDE_INDICE_MCP = 0.05; // Distancia horizontal mínima desde el MCP del índice

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private authService: AuthService,
    private gestureService: GestureDetectionService,
    private ngZone: NgZone,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    console.log('QuizTresPage: Componente cargado');
    this.route.paramMap.subscribe(params => {
      const levelIdParam = params.get('levelId');
      const subnivelIdParam = params.get('subnivelId');

      if (levelIdParam && subnivelIdParam) {
        this.levelId = +levelIdParam;
        this.subnivelId = +subnivelIdParam;
        console.log(`QuizTresPage: Recibido levelId: ${this.levelId}, subnivelId: ${this.subnivelId}`);
      } else {
        console.error('QuizTresPage: ID de nivel o subnivel no proporcionado.');
        this.presentAlert('Error', 'No se pudo cargar el quiz. Faltan IDs.');
        this.navCtrl.back();
      }
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        console.log('QuizTresPage: No hay usuario, redirigiendo a login...');
        this.router.navigate(['/login']);
      }
    });

    console.log('QuizTresPage: Verificando videoElement:', this.videoElement);
    if (this.videoElement && this.videoElement.nativeElement) {
      console.log('QuizTresPage: videoElement.nativeElement:', this.videoElement.nativeElement);
      this.gestureService.initialize(this.videoElement.nativeElement, this.onResults.bind(this), () => {});
      console.log('QuizTresPage: GestureService inicializado.');
    } else {
      console.error('QuizTresPage: videoElement no está disponible en ngOnInit.');
    }
  }

  ngOnDestroy() {
    console.log('QuizTresPage: Componente destruido. Deteniendo GestureService.');
    this.gestureService.stop();
  }

  onResults(results: any) {
    this.ngZone.run(() => {
      this.gestureDetected = ''; // Reiniciar en cada frame a menos que se detecte
      this.llmFeedback = '';

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0]; // Usar la primera mano detectada

        if (this.detectarGestoBebidaAlcoholica(landmarks)) {
          if (this.gestureDetected !== 'Bebida Alcohólica') {
            this.gestureDetected = 'Bebida Alcohólica';
            console.log('QuizTresPage: GESTO DETECTADO: Bebida Alcohólica');
            if (!this.quizCompleted) {
              this.generarFeedbackGesto('Bebida Alcohólica');
              this.submitQuiz();
            }
          }
        }
      }
    });
  }

  // --- Métodos de detección del estado de los dedos ---

  private estaDedoExtendido(puntaY: number, refY: number, umbral: number = this.UMBRAL_Y_DEDO): boolean {
    // El dedo está extendido si su punta está "por encima" (valor Y más pequeño) de su punto de referencia (MCP o IP)
    return puntaY < refY - umbral;
  }

  private estaDedoFlexionado(puntaY: number, refY: number, umbral: number = this.UMBRAL_Y_DEDO): boolean {
    // El dedo está flexionado si su punta está "por debajo" (valor Y más grande) de su punto de referencia (MCP o IP)
    return puntaY > refY + umbral;
  }

  // --- Detección del Gesto "Bebida Alcohólica" ---
  detectarGestoBebidaAlcoholica(landmarks: any): boolean {
    // Pulgar: Extendido (punta por encima de la articulación IP y separado horizontalmente)
    const puntaPulgarY = landmarks[HandLandmark.THUMB_TIP].y;
    const ipPulgarY = landmarks[HandLandmark.THUMB_IP].y;
    const mcpPulgarX = landmarks[HandLandmark.THUMB_MCP].x;
    const puntaPulgarX = landmarks[HandLandmark.THUMB_TIP].x;
    const mcpIndiceX = landmarks[HandLandmark.INDEX_FINGER_MCP].x;

    const pulgarExtendidoVerticalmente = this.estaDedoExtendido(puntaPulgarY, ipPulgarY, this.UMBRAL_Y_PULGAR);
    // Comprobar si el pulgar está al costado de la mano (ej. más alejado del MCP del índice que su propio MCP)
    // Esta es una verificación de separación simplificada; ajustar si es necesario según la orientación de la mano.
    const pulgarSeparadoHorizontalmente = Math.abs(puntaPulgarX - mcpIndiceX) > Math.abs(mcpPulgarX - mcpIndiceX) + this.UMBRAL_X_PULGAR_DESDE_INDICE_MCP;

    const pulgarExtendido = pulgarExtendidoVerticalmente && pulgarSeparadoHorizontalmente;

    // Meñique: Extendido (punta por encima de la articulación MCP)
    const puntaMeniqueY = landmarks[HandLandmark.PINKY_TIP].y;
    const mcpMeniqueY = landmarks[HandLandmark.PINKY_MCP].y;
    const meniqueExtendido = this.estaDedoExtendido(puntaMeniqueY, mcpMeniqueY);

    // Dedo Índice: Flexionado (punta por debajo de la articulación PIP)
    const puntaIndiceY = landmarks[HandLandmark.INDEX_FINGER_TIP].y;
    const pipIndiceY = landmarks[HandLandmark.INDEX_FINGER_PIP].y;
    const indiceFlexionado = this.estaDedoFlexionado(puntaIndiceY, pipIndiceY);

    // Dedo Medio: Flexionado (punta por debajo de la articulación PIP)
    const puntaMedioY = landmarks[HandLandmark.MIDDLE_FINGER_TIP].y;
    const pipMedioY = landmarks[HandLandmark.MIDDLE_FINGER_PIP].y;
    const medioFlexionado = this.estaDedoFlexionado(puntaMedioY, pipMedioY);

    // Dedo Anular: Flexionado (punta por debajo de la articulación PIP)
    const puntaAnularY = landmarks[HandLandmark.RING_FINGER_TIP].y;
    const pipAnularY = landmarks[HandLandmark.RING_FINGER_PIP].y;
    const anularFlexionado = this.estaDedoFlexionado(puntaAnularY, pipAnularY);
    
    // Logs de depuración (opcional, se pueden eliminar después de probar)
    // console.log(`Pulgar: ExtV=${pulgarExtendidoVerticalmente}, ExtH=${pulgarSeparadoHorizontalmente} => ${pulgarExtendido}`);
    // console.log(`Meñique: Ext=${meniqueExtendido}`);
    // console.log(`Índice: Flex=${indiceFlexionado}, Medio: Flex=${medioFlexionado}, Anular: Flex=${anularFlexionado}`);

    return pulgarExtendido && meniqueExtendido && indiceFlexionado && medioFlexionado && anularFlexionado;
  }

  async generarFeedbackGesto(gesto: string) {
    this.llmFeedback = `¡Gesto de "${gesto}" detectado! ¡Muy bien!`;
    console.log(`Feedback generado para: ${gesto}`);
  }

  async submitQuiz() {
    if (!this.currentUser || this.levelId === null || this.subnivelId === null || this.quizCompleted) {
      console.log('SubmitQuiz: Condiciones no cumplidas para enviar.', 
                  { userId: this.currentUser?.id, levelId: this.levelId, subnivelId: this.subnivelId, quizCompleted: this.quizCompleted });
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Guardando tu progreso del quiz...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      this.currentScore = Math.floor(Math.random() * 31) + 70; // Puntaje entre 70 y 100
      this.quizCompleted = true;

      console.log(`SubmitQuiz: Actualizando progreso para subnivel ${this.subnivelId}, usuario ${this.currentUser.id}, puntaje ${this.currentScore}`);
      await this.dataService.updateProgresoSubnivel(
        this.currentUser.id,
        this.subnivelId,
        true,
        this.currentScore
      );
      console.log(`Progreso del Subnivel ${this.subnivelId} para nivel ${this.levelId} actualizado.`);

      await this.presentAlert('¡Quiz Completado!', `¡Has completado este quiz! Tu puntaje: ${this.currentScore}.`);
      this.router.navigate(['/level-detail', this.levelId]); 

    } catch (error: any) {
      console.error('Error al completar quiz:', error);
      await this.presentAlert('Error', `No se pudo guardar tu progreso: ${error?.message || 'Error desconocido'}`);
      this.quizCompleted = false; // Permitir reintentar si falla el guardado
    } finally {
      loading.dismiss();
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
      backdropDismiss: false
    });
    await alert.present();
  }
}