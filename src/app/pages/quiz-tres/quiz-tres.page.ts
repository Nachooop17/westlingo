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

// Landmark de FaceMesh para la barbilla
const FACE_MESH_CHIN_LANDMARK_INDEX = 152; 

// Umbrales para la detección MUY simplificada de "DUDA" (solo posición del pulgar)
const NEAR_CHIN_THRESHOLD_THUMB = 0.099; // Umbral de distancia para el pulgar cerca de la barbilla (ajustar)
const THUMB_ABOVE_CHIN_OFFSET_Y = 0.01; // Para asegurar que el pulgar esté visiblemente arriba o a la altura de la barbilla (Y disminuye hacia arriba)

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

  gestureDetected: string = '';
  llmFeedback: string = ''; 

  private lastFacialReferencePoint: { x: number, y: number, z?: number } | null = null;

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

    if (this.videoElement && this.videoElement.nativeElement) {
      this.gestureService.initialize(
        this.videoElement.nativeElement,
        this.onHandResults.bind(this),
        this.onFaceResults.bind(this)
      );
      console.log('QuizTresPage: GestureService inicializado con detección de manos y cara.');
    } else {
      console.error('QuizTresPage: videoElement no está disponible en ngOnInit.');
    }
  }

  ngOnDestroy() {
    console.log('QuizTresPage: Componente destruido. Deteniendo GestureService.');
    this.gestureService.stop();
  }

  onFaceResults(results: any) {
    this.ngZone.run(() => {
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const faceLandmarks = results.multiFaceLandmarks[0];
        const chinPoint = faceLandmarks[FACE_MESH_CHIN_LANDMARK_INDEX];
        if (chinPoint) {
          this.lastFacialReferencePoint = { x: chinPoint.x, y: chinPoint.y, z: chinPoint.z };
        } else {
          this.lastFacialReferencePoint = null;
        }
      } else {
        this.lastFacialReferencePoint = null;
      }
    });
  }

  onHandResults(results: any) {
    this.ngZone.run(() => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0]; // Usar la primera mano detectada
        // Ya no necesitamos 'handedness' para esta detección simplificada

        if (this.detectarGestoDuda(landmarks, this.lastFacialReferencePoint)) {
          const gestureName = 'DUDA';
          if (this.gestureDetected !== gestureName) {
            this.gestureDetected = gestureName;
            console.log(`QuizTresPage: GESTO DETECTADO: ${gestureName}`);
            if (!this.quizCompleted) {
              this.generarFeedbackGesto(gestureName);
              this.submitQuiz();
            }
          }
        } else {
          if (this.gestureDetected) {
            this.gestureDetected = '';
            this.llmFeedback = '';
          }
        }
      } else {
        if (this.gestureDetected) {
          this.gestureDetected = '';
          this.llmFeedback = '';
        }
      }
    });
  }
  
  private isPointNearFacialPoint(handPoint: any, facialPoint: {x: number, y: number, z?:number} | null, threshold: number): boolean {
    if (facialPoint && handPoint) {
      const dx = handPoint.x - facialPoint.x;
      const dy = handPoint.y - facialPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy); 
      return distance < threshold;
    }
    return false;
  }

  detectarGestoDuda(landmarks: any, facialPoint: {x: number, y: number, z?:number} | null): boolean {
    if (!landmarks || !facialPoint) {
      console.log('DetectarDUDA (Simplificado): Faltan landmarks de mano o punto facial.');
      return false;
    }

    const thumbTip = landmarks[HandLandmark.THUMB_TIP];

    console.log('--- Iniciando Detección DUDA (Simplificado) ---');
    console.log(`FacialPoint (Barbilla ${FACE_MESH_CHIN_LANDMARK_INDEX}): x=${facialPoint.x.toFixed(3)}, y=${facialPoint.y.toFixed(3)}`);
    console.log(`ThumbTip: x=${thumbTip.x.toFixed(3)}, y=${thumbTip.y.toFixed(3)}`);
    
    // 1. Pulgar cerca de la barbilla
    const thumbNearChin = this.isPointNearFacialPoint(thumbTip, facialPoint, NEAR_CHIN_THRESHOLD_THUMB);
    console.log(`Condición 1 (thumbNearChin): ${thumbNearChin}.`);

    // 2. Pulgar un poco arriba o a la altura de la barbilla
    const targetThumbY = facialPoint.y - THUMB_ABOVE_CHIN_OFFSET_Y;
    const thumbAboveOrAtChin = thumbTip.y < targetThumbY; 
    console.log(`Condición 2 (thumbAboveOrAtChin): ${thumbAboveOrAtChin}. (thumbTip.y=${thumbTip.y.toFixed(3)} < targetThumbY=${targetThumbY.toFixed(3)})`);
    
    const result = thumbNearChin && thumbAboveOrAtChin;
    if (result) {
      console.log('¡¡¡ GESTO "DUDA" (Simplificado) DETECTADO !!!');
    } else {
      console.log('Gesto "DUDA" (Simplificado) NO detectado. Revisar condiciones individuales:');
      if (!thumbNearChin) console.log("  Falla Condición 1: Pulgar no cerca de barbilla.");
      if (!thumbAboveOrAtChin) console.log("  Falla Condición 2: Pulgar no arriba/altura de barbilla.");
    }
    console.log('--- Fin Detección DUDA (Simplificado) ---');
    return result;
  }

  async generarFeedbackGesto(gesto: string) {
    this.llmFeedback = `¡Gesto de "${gesto}" detectado! ¡Correcto!`;
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

      await this.presentAlert('¡Quiz Completado!', `¡Has completado el quiz de "${this.gestureDetected}"! Tu puntaje: ${this.currentScore}.`);
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