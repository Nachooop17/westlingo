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
  selector: 'app-quiz-uno',
  templateUrl: './quiz-uno.page.html',
  styleUrls: ['./quiz-uno.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonicModule
  ]
})
export class QuizUnoPage implements OnInit, OnDestroy {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;

  levelId: number | null = null;
  subnivelId: number | null = null;
  currentUser: User | null = null;
  currentScore: number = 0;
  quizCompleted: boolean = false;

  // --- Propiedades para detección de gestos ---
  gestureDetected: string = '';
  private wristXHistory: number[] = [];
  private readonly WAVE_HISTORY_LENGTH = 10; 
  private readonly WAVE_X_THRESHOLD = 0.001;  // *** AJUSTADO PARA MAYOR SENSIBILIDAD ***
  private readonly MIN_WAVES_DETECTED = 2;   // Dos cambios de dirección son suficientes
  
  private waveDirectionChanges: number = 0;
  private lastWaveDirection: 'LEFT' | 'RIGHT' | 'NONE' = 'NONE';
  private lastSignificantX: number | null = null;
  private waveDetectionTimeout: any = null;
  private readonly WAVE_RESET_TIMEOUT_MS = 1500; 

  // Estos umbrales son para areAllFiveFingersExtended
  private readonly FINGER_EXTENSION_THRESHOLD = 0.05; 
  private readonly THUMB_SPREAD_HORIZONTAL_THRESHOLD = 0.08; 
  // -------------------------------------------

  // --- Propiedades para la integración con Gemini API ---
  llmFeedback: string = '';
  isGeneratingFeedback: boolean = false;
  // ----------------------------------------------------

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
    console.log('QuizUnoPage: Componente cargado');
    this.route.paramMap.subscribe(params => {
      const levelIdParam = params.get('levelId');
      const subnivelIdParam = params.get('subnivelId');

      if (levelIdParam && subnivelIdParam) {
        this.levelId = +levelIdParam;
        this.subnivelId = +subnivelIdParam;
        console.log(`QuizUnoPage: Recibido levelId: ${this.levelId}, subnivelId: ${this.subnivelId}`);
      } else {
        console.error('QuizUnoPage: ID de nivel o subnivel no proporcionado.');
        this.presentAlert('Error', 'No se pudo cargar el quizz. Faltan IDs.');
        this.navCtrl.back();
      }
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        console.log('QuizUnoPage: No hay usuario, redirigiendo a login...');
        this.router.navigate(['/login']);
      }
    });

    console.log('QuizUnoPage: Verificando videoElement:', this.videoElement);
    if (this.videoElement && this.videoElement.nativeElement) {
      console.log('QuizUnoPage: videoElement.nativeElement:', this.videoElement.nativeElement);
      this.gestureService.initialize(this.videoElement.nativeElement, this.onResults.bind(this), () => {});
      console.log('QuizUnoPage: GestureService initialized.');
    } else {
      console.error('QuizUnoPage: videoElement no está disponible en ngOnInit.');
    }
  }

  ngOnDestroy() {
    console.log('QuizUnoPage: Componente destruido. Deteniendo GestureService.');
    this.gestureService.stop();
    if (this.waveDetectionTimeout) {
      clearTimeout(this.waveDetectionTimeout);
      this.waveDetectionTimeout = null;
    }
  }

  // --- Métodos de detección de gestos ---
  onResults(results: any) {
    // Comentado para reducir spam en consola, descomentar si se necesita depurar `results`
    // console.log('QuizUnoPage: onResults CALLED with results:', results); 
    this.ngZone.run(() => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];

        const isGoodbyeGesture = this.detectGoodbyeWave(landmarks);

        if (isGoodbyeGesture) {
          if (this.gestureDetected !== 'Adiós') {
            this.gestureDetected = 'Adiós';
            // El log "GESTO DETECTADO" ya está en detectGoodbyeWave
            // this.resetWaveDetection(); // Se resetea dentro de detectGoodbyeWave al confirmarse
            
            if (!this.quizCompleted) {
              this.generateGestureFeedback('Adiós'); // Mantenemos feedback si existe
              this.submitQuiz();
            }
          }
        } else {
          // Si detectGoodbyeWave devuelve false y no se ha detectado 'Adiós',
          // podría ser porque la mano no está extendida o el movimiento no es concluyente.
          // this.gestureDetected = ''; // Evita limpiar el gesto si ya se detectó y está en proceso de submit
        }
      } else {
        // No se detectan manos, reseteamos el estado de detección si estaba en progreso
        if (this.waveDirectionChanges > 0 || this.gestureDetected === 'Adiós') { // Solo resetea si había algo en progreso o detectado
            console.log("DEBUG_RESET: No se detectan manos, reseteando detección de ola.");
            this.resetWaveDetection();
        }
        this.gestureDetected = ''; // Siempre limpia el gesto si no hay manos
      }
    });
  }

  isFingerExtended(tip: any, mcp: any): boolean {
    return tip.y < mcp.y - this.FINGER_EXTENSION_THRESHOLD * 0.1; 
  }

  areAllFiveFingersExtended(landmarks: any): boolean {
    const indexExtended = this.isFingerExtended(landmarks[HandLandmark.INDEX_FINGER_TIP], landmarks[HandLandmark.INDEX_FINGER_MCP]);
    const middleExtended = this.isFingerExtended(landmarks[HandLandmark.MIDDLE_FINGER_TIP], landmarks[HandLandmark.MIDDLE_FINGER_MCP]);
    const ringExtended = this.isFingerExtended(landmarks[HandLandmark.RING_FINGER_TIP], landmarks[HandLandmark.RING_FINGER_MCP]);
    const pinkyExtended = this.isFingerExtended(landmarks[HandLandmark.PINKY_TIP], landmarks[HandLandmark.PINKY_MCP]);

    const thumbTipX = landmarks[HandLandmark.THUMB_TIP].x;
    const thumbCmcX = landmarks[HandLandmark.THUMB_CMC].x; 
    const indexFingerMcpX = landmarks[HandLandmark.INDEX_FINGER_MCP].x;
    
    const thumbSpread = Math.abs(thumbTipX - indexFingerMcpX) > this.THUMB_SPREAD_HORIZONTAL_THRESHOLD;
    
    // const thumbExtendedRelativeToWrist = (
    //     (landmarks[HandLandmark.WRIST].x < thumbCmcX && thumbCmcX < thumbTipX) || 
    //     (landmarks[HandLandmark.WRIST].x > thumbCmcX && thumbCmcX > thumbTipX)    
    // );

    const extendedFingersCount = [indexExtended, middleExtended, ringExtended, pinkyExtended].filter(isExtended => isExtended).length;
    // console.log(`DEBUG_ALL_FINGERS: Dedos (no pulgar) extendidos (cuenta): ${extendedFingersCount}`);
    // console.log(`DEBUG_ALL_FINGERS: Pulgar separado: ${thumbSpread}`);
    
    const result = extendedFingersCount >= 3 && thumbSpread; 
    if (!result) {
        // console.log(`DEBUG_ALL_FINGERS: Condición de mano extendida NO cumplida. Dedos: ${extendedFingersCount}/4, Pulgar separado: ${thumbSpread}`);
    } else {
        // console.log(`DEBUG_ALL_FINGERS: Condición de mano extendida CUMPLIDA.`);
    }
    return result;
  }


  detectGoodbyeWave(landmarks: any): boolean {
    if (!this.areAllFiveFingersExtended(landmarks)) { 
      if (this.waveDirectionChanges > 0) {
        console.log("DEBUG_WAVE: Mano no extendida, reseteando detección de ola en progreso.");
        this.resetWaveDetection();
      }
      return false;
    }

    const wristX = landmarks[HandLandmark.WRIST].x;

    if (this.lastSignificantX === null) {
        console.log("DEBUG_WAVE: Inicializando detección de ola (lastSignificantX era null).");
        this.lastSignificantX = wristX;
        this.wristXHistory = [wristX];
        this.waveDirectionChanges = 0;
        this.lastWaveDirection = 'NONE';
        this.setWaveTimeout(); 
        return false;
    }

    this.wristXHistory.push(wristX);
    if (this.wristXHistory.length > this.WAVE_HISTORY_LENGTH) {
      this.wristXHistory.shift(); 
    }
    
    if (this.wristXHistory.length < Math.min(5, this.WAVE_HISTORY_LENGTH)) { 
        // console.log("DEBUG_WAVE: Acumulando historial de muñeca, frames:", this.wristXHistory.length);
        this.setWaveTimeout(); 
        return false;
    }
    
    const avgX = this.wristXHistory.reduce((acc, val) => acc + val, 0) / this.wristXHistory.length;
    const movementDelta = avgX - this.lastSignificantX;

    this.setWaveTimeout(); 

    // console.log(`DEBUG_WAVE: Muñeca X: ${wristX.toFixed(3)}, AvgX: ${avgX.toFixed(3)}, Delta: ${movementDelta.toFixed(3)}, Cambios: ${this.waveDirectionChanges}, Dirección Anterior: ${this.lastWaveDirection}`);

    if (Math.abs(movementDelta) > this.WAVE_X_THRESHOLD) {
      const currentDirection = movementDelta > 0 ? 'RIGHT' : 'LEFT';
      // console.log(`DEBUG_WAVE: Movimiento significativo detectado. Dirección actual: ${currentDirection}`);

      if (this.lastWaveDirection !== 'NONE' && this.lastWaveDirection !== currentDirection) {
        this.waveDirectionChanges++;
        console.log(`DEBUG_WAVE: *** Cambio de dirección detectado! (${this.lastWaveDirection} -> ${currentDirection}). Total cambios: ${this.waveDirectionChanges}`);
      } else if (this.lastWaveDirection === 'NONE') {
        // console.log(`DEBUG_WAVE: Primer movimiento significativo en dirección: ${currentDirection}`);
      }
      
      this.lastWaveDirection = currentDirection;
      this.lastSignificantX = avgX; 

      if (this.waveDirectionChanges >= this.MIN_WAVES_DETECTED) {
        console.log("DEBUG_WAVE: --- Umbral de cambios de dirección alcanzado (" + this.waveDirectionChanges + "/" + this.MIN_WAVES_DETECTED + "), GESTO COMPLETADO! ---");
        this.resetWaveDetection(); 
        return true;
      }
    }
    return false;
  }

  setWaveTimeout() {
    if (this.waveDetectionTimeout) {
      clearTimeout(this.waveDetectionTimeout);
    }
    this.waveDetectionTimeout = setTimeout(() => {
      if (this.waveDirectionChanges > 0 || this.gestureDetected === 'Adiós') { 
        console.log("DEBUG_WAVE: Timeout de ola, reseteando detección. Cambios realizados:", this.waveDirectionChanges);
      }
      this.resetWaveDetection();
    }, this.WAVE_RESET_TIMEOUT_MS);
  }

  resetWaveDetection() {
    // console.log("DEBUG_RESET: Reseteando estado de detección de ola.");
    this.wristXHistory = [];
    this.waveDirectionChanges = 0;
    this.lastWaveDirection = 'NONE';
    this.lastSignificantX = null;
    if (this.waveDetectionTimeout) {
      clearTimeout(this.waveDetectionTimeout);
      this.waveDetectionTimeout = null;
    }
  }
  // --------------------------------------------------------------------

  async generateGestureFeedback(gesture: string) {
    this.llmFeedback = `¡Gesto de "${gesture}" detectado! ¡Buen trabajo!`;
    console.log(`Feedback generado para: ${gesture}`);
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
      this.quizCompleted = false; 
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