// src/app/pages/quiz-dos/quiz-dos.page.ts
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
  selector: 'app-quiz-dos', // Selector único para quiz-dos
  templateUrl: './quiz-dos.page.html',
  styleUrls: ['./quiz-dos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonicModule
  ]
})
export class QuizDosPage implements OnInit, OnDestroy {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;

  levelId: number | null = null;
  subnivelId: number | null = null; // Propiedad para el ID del subnivel
  currentUser: User | null = null;
  currentScore: number = 0;
  quizCompleted: boolean = false;

  // --- Propiedades para detección de gestos ---
  gestureDetected: string = '';
  private wristXHistory: number[] = [];
  private readonly WAVE_HISTORY_LENGTH = 15;
  private readonly WAVE_X_THRESHOLD = 0.02; 
  private readonly MIN_WAVES_DETECTED = 2;
  
  private waveDirectionChanges: number = 0;
  private lastWaveDirection: 'LEFT' | 'RIGHT' | 'NONE' = 'NONE';
  private lastSignificantX: number | null = null;
  private waveDetectionTimeout: any = null;
  private readonly WAVE_RESET_TIMEOUT_MS = 1200;

  private readonly FINGER_EXTENSION_THRESHOLD = 0.05;
  private readonly THUMB_SPREAD_HORIZONTAL_THRESHOLD = 0.1;
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
    console.log('QuizDosPage: Componente cargado');
    this.route.paramMap.subscribe(params => {
      const levelIdParam = params.get('levelId');
      const subnivelIdParam = params.get('subnivelId'); // Capturar el subnivelId

      if (levelIdParam && subnivelIdParam) {
        this.levelId = +levelIdParam;
        this.subnivelId = +subnivelIdParam; // Asignar subnivelId
        console.log(`QuizDosPage: Recibido levelId: ${this.levelId}, subnivelId: ${this.subnivelId}`);
      } else {
        console.error('QuizDosPage: ID de nivel o subnivel no proporcionado.');
        this.presentAlert('Error', 'No se pudo cargar el quizz. Faltan IDs.');
        this.navCtrl.back();
      }
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        console.log('QuizDosPage: No hay usuario, redirigiendo a login...');
        this.router.navigate(['/login']);
      }
    });

    if (this.videoElement && this.videoElement.nativeElement) {
      this.gestureService.initialize(this.videoElement.nativeElement, this.onResults.bind(this));
    } else {
      console.error('QuizDosPage: videoElement no está disponible en ngOnInit.');
    }
  }

  ngOnDestroy() {
    this.gestureService.stop();
    if (this.waveDetectionTimeout) {
      clearTimeout(this.waveDetectionTimeout);
    }
  }

  // --- Métodos de detección de gestos (copiados de quiz-uno) ---
  onResults(results: any) {
    this.ngZone.run(() => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];

        const isGoodbyeGesture = this.detectGoodbyeWave(landmarks);

        if (isGoodbyeGesture) {
          if (this.gestureDetected !== 'Adiós') {
            this.gestureDetected = 'Adiós';
            console.log('QuizDosPage: GESTO DETECTADO: Adiós');
            this.resetWaveDetection();
            
            if (!this.quizCompleted) {
              this.generateGestureFeedback('Adiós');
              this.submitQuiz();
            }
          }
        } else {
          this.gestureDetected = '';
        }
      } else {
        this.gestureDetected = '';
      }
    });
  }

  isFingerExtended(tip: any, mcp: any): boolean {
    const distance = Math.hypot(tip.x - mcp.x, tip.y - mcp.y, tip.z - mcp.z);
    return distance > this.FINGER_EXTENSION_THRESHOLD;
  }

  areAllFiveFingersExtended(landmarks: any): boolean {
    const indexExtended = this.isFingerExtended(landmarks[HandLandmark.INDEX_FINGER_TIP], landmarks[HandLandmark.INDEX_FINGER_MCP]);
    const middleExtended = this.isFingerExtended(landmarks[HandLandmark.MIDDLE_FINGER_TIP], landmarks[HandLandmark.MIDDLE_FINGER_MCP]);
    const ringExtended = this.isFingerExtended(landmarks[HandLandmark.RING_FINGER_TIP], landmarks[HandLandmark.RING_FINGER_MCP]);
    const pinkyExtended = this.isFingerExtended(landmarks[HandLandmark.PINKY_TIP], landmarks[HandLandmark.PINKY_MCP]);

    const thumbExtended = this.isFingerExtended(landmarks[HandLandmark.THUMB_TIP], landmarks[HandLandmark.THUMB_CMC]); 

    const extendedFingersCount = [indexExtended, middleExtended, ringExtended, pinkyExtended, thumbExtended]
                                  .filter(isExtended => isExtended).length;
    // console.log(`DEBUG_ALL_FINGERS: Dedos extendidos (cuenta): ${extendedFingersCount}`);
    
    const thumbX = landmarks[HandLandmark.THUMB_TIP].x;
    const indexX = landmarks[HandLandmark.INDEX_FINGER_MCP].x;
    const thumbSpreadDelta = Math.abs(thumbX - indexX);

    const isThumbSpread = thumbSpreadDelta > this.THUMB_SPREAD_HORIZONTAL_THRESHOLD;
    
    const result = extendedFingersCount >= 3 && isThumbSpread;
    // console.log(`DEBUG_ALL_FINGERS: Condición de dedos extendidos y pulgar separado (resultado): ${result}`);
    return result;
  }


  detectGoodbyeWave(landmarks: any): boolean {
    if (!this.areAllFiveFingersExtended(landmarks)) { 
      this.resetWaveDetection();
      return false;
    }

    const wristX = landmarks[HandLandmark.WRIST].x;

    this.wristXHistory.push(wristX);
    if (this.wristXHistory.length > this.WAVE_HISTORY_LENGTH) {
      this.wristXHistory.shift(); 
    }
    
    const avgX = this.wristXHistory.reduce((acc, val) => acc + val, 0) / this.wristXHistory.length;
    
    if (this.wristXHistory.length < this.WAVE_HISTORY_LENGTH) {
        return false;
    }
    
    if (this.lastSignificantX === null) {
        this.lastSignificantX = avgX;
        return false;
    }

    const movementDelta = avgX - this.lastSignificantX;

    if (this.waveDetectionTimeout) {
      clearTimeout(this.waveDetectionTimeout);
    }
    this.waveDetectionTimeout = setTimeout(() => {
      // console.log("DEBUG_WAVE: Timeout de ola, reseteando detección.");
      this.resetWaveDetection();
    }, this.WAVE_RESET_TIMEOUT_MS);

    // console.log(`DEBUG_WAVE: Muñeca X: ${wristX.toFixed(3)}, AvgX: ${avgX.toFixed(3)}, Delta: ${movementDelta.toFixed(3)}, Cambios: ${this.waveDirectionChanges}`);

    if (Math.abs(movementDelta) > this.WAVE_X_THRESHOLD) {
      const currentDirection = movementDelta > 0 ? 'RIGHT' : 'LEFT';

      if (this.lastWaveDirection !== 'NONE' && this.lastWaveDirection !== currentDirection) {
        this.waveDirectionChanges++;
        // console.log(`DEBUG_WAVE: *** Cambio de dirección detectado! Total cambios: ${this.waveDirectionChanges}`);
      }
      
      this.lastWaveDirection = currentDirection;
      this.lastSignificantX = avgX; 

      if (this.waveDirectionChanges >= this.MIN_WAVES_DETECTED) {
        // console.log("DEBUG_WAVE: --- Umbral de cambios de dirección alcanzado, GESTO COMPLETADO! ---");
        return true;
      }
    }
    return false;
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
    this.gestureDetected = '';
    this.llmFeedback = '';
  }
  // --------------------------------------------------------------------

  /**
   * ✨ Genera retroalimentación para el gesto detectado usando la API de Gemini.
   * @param gesture El nombre del gesto detectado (ej. 'Adiós').
   */
  async generateGestureFeedback(gesture: string) {
    this.isGeneratingFeedback = true;
    this.llmFeedback = '';

    try {
      const prompt = `Genera un mensaje corto, alentador y divertido sobre el gesto de "${gesture}" que acaba de ser detectado. Debe sonar como si una IA amigable estuviera felicitando al usuario. Máximo 20 palabras.`;
      
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });

      const payload = { contents: chatHistory };
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        this.llmFeedback = result.candidates[0].content.parts[0].text;
      } else {
        this.llmFeedback = 'No pude generar una respuesta. Intenta de nuevo.';
        console.error('Gemini API: Estructura de respuesta inesperada o contenido faltante.');
      }
    } catch (error) {
      console.error('Error al llamar a la API de Gemini:', error);
      this.llmFeedback = 'Hubo un error al conectar con la IA. ¡Sigue intentándolo!';
    } finally {
      this.isGeneratingFeedback = false;
    }
  }

  /**
   * Completa el quiz (solo guarda su progreso, NO desbloquea el siguiente nivel).
   */
  async submitQuiz() {
    // Asegurarse de que subnivelId esté presente
    if (!this.currentUser || this.levelId === null || this.subnivelId === null || this.quizCompleted) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Guardando tu progreso...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      this.currentScore = Math.floor(Math.random() * 100) + 1; // Genera un puntaje de ejemplo
      this.quizCompleted = true;

      // Actualiza el progreso del subnivel específico (este quiz)
      await this.dataService.updateProgresoSubnivel(
        this.currentUser.id,
        this.subnivelId, // Usamos el subnivelId específico de este quiz
        true,
        this.currentScore
      );
      console.log(`Progreso del Subnivel ${this.subnivelId} para nivel ${this.levelId} actualizado.`);

      await this.presentAlert('¡Quizz Completado!', `¡Has completado este quiz! Tu puntaje: ${this.currentScore}.`);
      // Navega de vuelta a la página del nivel actual
      this.router.navigate(['/level-detail', this.levelId]); 

    } catch (error: any) {
      console.error('Error al completar quiz:', error);
      await this.presentAlert('Error', `No se pudo guardar tu progreso: ${error?.message || 'Error desconocido'}`);
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
