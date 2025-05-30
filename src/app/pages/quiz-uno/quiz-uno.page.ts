// src/app/pages/quiz-uno/quiz-uno.page.ts
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importar CommonModule para *ngIf
import { 
  AlertController, 
  LoadingController, 
  NavController,
  IonicModule // <--- IMPORTAR IonicModule AQUÍ
} from '@ionic/angular'; 
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service'; // Ajusta la ruta si es necesario
import { GestureDetectionService } from 'src/app/services/gesture-detection.service'; // Ajusta la ruta si es necesario
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
  imports: [ // <--- CORRECCIÓN EN ESTE ARRAY
    CommonModule, // Para *ngIf
    RouterModule, // Para routerLink
    IonicModule // <--- IMPORTAR IonicModule para todos los componentes Ionic
  ]
})
export class QuizUnoPage implements OnInit, OnDestroy {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;

  levelId: number | null = null;
  currentUser: User | null = null;
  currentScore: number = 0;
  quizCompleted: boolean = false;

  // --- Propiedades para detección de gestos ---
  gestureDetected: string = '';
  private wristXHistory: number[] = [];
  private readonly WAVE_HISTORY_LENGTH = 15;
  private readonly WAVE_X_THRESHOLD = 0.08;
  private readonly MIN_WAVES_DETECTED = 2;
  
  private waveDirectionChanges: number = 0;
  private lastWaveDirection: 'LEFT' | 'RIGHT' | 'NONE' = 'NONE';
  private lastSignificantX: number | null = null;
  private waveDetectionTimeout: any = null;
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
      const idParam = params.get('levelId');
      if (idParam) {
        this.levelId = +idParam;
        console.log('QuizUnoPage: Recibido levelId:', this.levelId);
      } else {
        console.error('QuizUnoPage: No se recibió levelId.');
        this.presentAlert('Error', 'No se pudo cargar el quizz. Falta el ID del nivel.');
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

    if (this.videoElement && this.videoElement.nativeElement) {
      this.gestureService.initialize(this.videoElement.nativeElement, this.onResults.bind(this));
    } else {
      console.error('QuizUnoPage: videoElement no está disponible en ngOnInit.');
    }
  }

  ngOnDestroy() {
    this.gestureService.stop();
    if (this.waveDetectionTimeout) {
      clearTimeout(this.waveDetectionTimeout);
    }
  }

  // --- Métodos de detección de gestos ---
  onResults(results: any) {
    this.ngZone.run(() => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];

        const isGoodbyeGesture = this.detectGoodbyeWave(landmarks);

        if (isGoodbyeGesture) {
          if (this.gestureDetected !== 'Adiós') {
            this.gestureDetected = 'Adiós';
            console.log('GESTO DETECTADO: Adiós');
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
        if (this.gestureDetected === 'Adiós' || this.waveDirectionChanges > 0) {
          this.resetWaveDetection();
        }
        this.gestureDetected = '';
      }
    });
  }

  areFingersGenerallyExtended(landmarks: any): boolean {
    const indexFingerExtended = landmarks[HandLandmark.INDEX_FINGER_TIP].y < landmarks[HandLandmark.INDEX_FINGER_MCP].y;
    const middleFingerExtended = landmarks[HandLandmark.MIDDLE_FINGER_TIP].y < landmarks[HandLandmark.MIDDLE_FINGER_MCP].y;
    const ringFingerExtended = landmarks[HandLandmark.RING_FINGER_TIP].y < landmarks[HandLandmark.RING_FINGER_MCP].y;
    const pinkyFingerExtended = landmarks[HandLandmark.PINKY_TIP].y < landmarks[HandLandmark.PINKY_MCP].y;

    const extendedFingersCount = [indexFingerExtended, middleFingerExtended, ringFingerExtended, pinkyFingerExtended]
                                  .filter(isExtended => isExtended).length;
    return extendedFingersCount >= 3;
  }

  detectGoodbyeWave(landmarks: any): boolean {
    if (!this.areFingersGenerallyExtended(landmarks)) {
      this.resetWaveDetection();
      return false;
    }

    const wristX = landmarks[HandLandmark.WRIST].x;

    if (this.lastSignificantX === null) {
      this.lastSignificantX = wristX;
      this.wristXHistory = [wristX];
      return false;
    }

    this.wristXHistory.push(wristX);
    if (this.wristXHistory.length > this.WAVE_HISTORY_LENGTH) {
      this.wristXHistory.shift();
    }
    
    const avgX = this.wristXHistory.reduce((acc, val) => acc + val, 0) / this.wristXHistory.length;
    const movementDelta = avgX - this.lastSignificantX;

    if (this.waveDetectionTimeout) {
      clearTimeout(this.waveDetectionTimeout);
    }
    this.waveDetectionTimeout = setTimeout(() => {
      this.resetWaveDetection();
    }, 800);

    if (Math.abs(movementDelta) > this.WAVE_X_THRESHOLD) {
      const currentDirection = movementDelta > 0 ? 'RIGHT' : 'LEFT';

      if (this.lastWaveDirection !== 'NONE' && this.lastWaveDirection !== currentDirection) {
        this.waveDirectionChanges++;
      }
      
      this.lastWaveDirection = currentDirection;
      this.lastSignificantX = avgX;

      if (this.waveDirectionChanges >= this.MIN_WAVES_DETECTED) {
        return true;
      }
    }
    return false;
  }

  resetWaveDetection() {
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
   * Completa el quiz y desbloquea el siguiente nivel.
   */
  async submitQuiz() {
    if (!this.currentUser || this.levelId === null || this.quizCompleted) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Guardando tu progreso y desbloqueando el siguiente nivel...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      this.currentScore = Math.floor(Math.random() * 100) + 1;
      this.quizCompleted = true;

      // 1. Actualizar el progreso del quiz final
      await this.dataService.updateProgresoQuizzFinal(
        this.currentUser.id,
        this.levelId,
        true,
        this.currentScore
      );
      console.log(`Progreso del Quizz Final para nivel ${this.levelId} actualizado.`);

      // 2. Desbloquear el siguiente nivel
      const nextLevelId = this.levelId + 1;
      await this.dataService.updateNivelAccess(this.currentUser.id, nextLevelId, true);
      console.log(`Acceso al Nivel ${nextLevelId} desbloqueado para el usuario ${this.currentUser.id}.`);

      await this.presentAlert('¡Quizz Completado!', `¡Felicidades! Has desbloqueado el Nivel ${nextLevelId}. Tu puntaje: ${this.currentScore}.`);
      this.router.navigate(['/level-detail', this.levelId]); // O podrías navegar directamente al nuevo nivel: ['/level-detail', nextLevelId]

    } catch (error: any) {
      console.error('Error al completar quiz o desbloquear nivel:', error);
      await this.presentAlert('Error', `No se pudo guardar tu progreso o desbloquear el siguiente nivel: ${error?.message || 'Error desconocido'}`);
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
