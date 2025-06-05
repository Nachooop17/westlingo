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

const HandLandmark = {
  WRIST: 0,
  THUMB_CMC: 1, THUMB_MCP: 2, THUMB_IP: 3, THUMB_TIP: 4,
  INDEX_FINGER_MCP: 5, INDEX_FINGER_PIP: 6, INDEX_FINGER_DIP: 7, INDEX_FINGER_TIP: 8,
  MIDDLE_FINGER_MCP: 9, MIDDLE_FINGER_PIP: 10, MIDDLE_FINGER_DIP: 11, MIDDLE_FINGER_TIP: 12,
  RING_FINGER_MCP: 13, RING_FINGER_PIP: 14, RING_FINGER_DIP: 15, RING_FINGER_TIP: 16,
  PINKY_MCP: 17, PINKY_PIP: 18, PINKY_DIP: 19, PINKY_TIP: 20,
};

// Landmark de FaceMesh para la mejilla (ej. 234 es un punto en el pómulo/mejilla)
// Otros podrían ser 130 (mejilla derecha), 359 (mejilla izquierda). Ajusta según necesidad.
const FACE_MESH_TARGET_LANDMARK_INDEX = 234; // Cambiado a un nombre más genérico si se prefiere, o mantener CHEEK
// Umbral de distancia para considerar el dedo "cerca" de la mejilla.
// Si quieres que esté "pegado", este valor debe ser pequeño.
// Si es similar a "cerca de la barbilla", podría ser similar al umbral que usabas antes (ej. 0.10 o 0.07)
const NEAR_FACIAL_POINT_THRESHOLD = 0.07; // Ajusta este valor con pruebas

@Component({
  selector: 'app-quiz-dos',
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
  subnivelId: number | null = null;
  currentUser: User | null = null;
  currentScore: number = 0;
  quizCompleted: boolean = false;

  gestureDetected: string = '';
  private readonly FINGER_EXTENSION_THRESHOLD = 0.05; // Umbral original para extensión de dedos

  // Punto facial de referencia (mejilla en este caso) detectado por FaceMesh
  private lastFacialReferencePoint: {x: number, y: number, z?: number} | null = null;

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
    this.route.paramMap.subscribe(params => {
      const levelIdParam = params.get('levelId');
      const subnivelIdParam = params.get('subnivelId');
      if (levelIdParam && subnivelIdParam) {
        this.levelId = +levelIdParam;
        this.subnivelId = +subnivelIdParam;
      } else {
        this.presentAlert('Error', 'No se pudo cargar el quizz. Faltan IDs.');
        this.navCtrl.back();
      }
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      }
    });

    if (this.videoElement && this.videoElement.nativeElement) {
      this.gestureService.initialize(
        this.videoElement.nativeElement,
        this.onHandResults.bind(this),
        this.onFaceResults.bind(this)
      );
    }
  }

  ngOnDestroy() {
    this.gestureService.stop();
  }

  // Callback de FaceMesh: guarda el punto facial de referencia (mejilla)
  onFaceResults(results: any) {
    this.ngZone.run(() => {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            const faceLandmarks = results.multiFaceLandmarks[0];
            const facialPoint = faceLandmarks[FACE_MESH_TARGET_LANDMARK_INDEX];
            if (facialPoint) {
                this.lastFacialReferencePoint = { x: facialPoint.x, y: facialPoint.y, z: facialPoint.z };
                // console.log('Punto facial de referencia (mejilla) detectado:', this.lastFacialReferencePoint);
            } else {
                this.lastFacialReferencePoint = null;
            }
        } else {
            this.lastFacialReferencePoint = null;
        }
    });
  }

  /**
   * Procesa los resultados de MediaPipe Hands y detecta el gesto.
   */
  onHandResults(results: any) {
    this.ngZone.run(() => {
      if (!this.isHandPresent(results)) {
        if (this.gestureDetected) this.gestureDetected = '';
        return;
      }
      const landmarks = results.multiHandLandmarks[0];
      // console.log('Mano detectada');

      if (!this.isOnlyIndexFingerExtended(landmarks)) {
        if (this.gestureDetected) this.gestureDetected = '';
        // console.log('No hay solo un dedo (índice) extendido');
        return;
      }
      // console.log('Índice extendido y demás dedos doblados');

      // Cambiado para verificar proximidad a la mejilla
      if (!this.isIndexNearFacialReferencePoint(landmarks)) { // Nombre de función más genérico
        if (this.gestureDetected) this.gestureDetected = '';
        // console.log('Índice no está cerca del punto facial de referencia (mejilla)');
        return;
      }
      // console.log('Índice cerca del punto facial de referencia (mejilla)');

      const gestureName = '¿Quién? (en mejilla)'; // Mantener el nombre del gesto actualizado
      if (this.gestureDetected !== gestureName) {
        this.gestureDetected = gestureName;
        console.log(`QuizDosPage: GESTO DETECTADO: ${gestureName}`);
        if (!this.quizCompleted) {
          this.submitQuiz();
        }
      }
    });
  }

  isHandPresent(results: any): boolean {
    return results.multiHandLandmarks && results.multiHandLandmarks.length > 0;
  }

  isOnlyIndexFingerExtended(landmarks: any): boolean {
    const indexExtended = this.isFingerExtended(
      landmarks[HandLandmark.INDEX_FINGER_TIP],
      landmarks[HandLandmark.INDEX_FINGER_MCP],
      'INDEX'
    );
    const middleBent = !this.isFingerExtended(
      landmarks[HandLandmark.MIDDLE_FINGER_TIP],
      landmarks[HandLandmark.MIDDLE_FINGER_MCP],
      'MIDDLE'
    );
    const ringBent = !this.isFingerExtended(
      landmarks[HandLandmark.RING_FINGER_TIP],
      landmarks[HandLandmark.RING_FINGER_MCP],
      'RING'
    );
    const pinkyBent = !this.isFingerExtended(
      landmarks[HandLandmark.PINKY_TIP],
      landmarks[HandLandmark.PINKY_MCP],
      'PINKY'
    );
    const thumbBent = !this.isFingerExtended( // Usando la lógica original para el pulgar
      landmarks[HandLandmark.THUMB_TIP],
      landmarks[HandLandmark.THUMB_CMC], // O THUMB_MCP si es más apropiado para tu definición de "doblado"
      'THUMB'
    );
    return indexExtended && middleBent && ringBent && pinkyBent && thumbBent;
  }

  /**
   * Verifica si el índice está cerca del punto facial de referencia (mejilla).
   * Similar a la lógica original de isIndexNearChin.
   */
  isIndexNearFacialReferencePoint(landmarks: any): boolean {
    const indexTip = landmarks[HandLandmark.INDEX_FINGER_TIP];
    if (this.lastFacialReferencePoint) {
      const dx = indexTip.x - this.lastFacialReferencePoint.x;
      const dy = indexTip.y - this.lastFacialReferencePoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      // console.log(`Distancia índice-punto facial: ${distance.toFixed(3)}`);
      return distance < NEAR_FACIAL_POINT_THRESHOLD;
    } else {
      // Si no hay punto facial de referencia, no se puede cumplir la condición.
      // Podrías tener un fallback si lo deseas, como en tu isIndexNearChin original.
      // Por ejemplo, si quieres permitirlo basado solo en la posición Y si la cara no se detecta:
      // const indexY = indexTip.y;
      // const mejillaYThreshold = 0.5; // Ajustar este valor si usas fallback
      // return indexY < mejillaYThreshold; // Esto sería un fallback muy simple
      return false; // Es más estricto requerir la detección del punto facial.
    }
  }

  /**
   * Utilidad para saber si un dedo está extendido.
   * Revertido a la lógica que tenías en el ejemplo de quiz-dos para la barbilla.
   */
  isFingerExtended(tip: any, mcp: any, finger: string): boolean {
    if (finger === 'THUMB') {
      // Lógica original para el pulgar de tu ejemplo de quiz-dos.page.ts (isIndexNearChin)
      // Esto significaba que el pulgar estaba "extendido" si había una separación X.
      // Por lo tanto, para "thumbBent = true", esta condición debe ser falsa.
      return Math.abs(tip.x - mcp.x) > this.FINGER_EXTENSION_THRESHOLD;
    } else {
      // Lógica original para otros dedos
      return (mcp.y - tip.y) > this.FINGER_EXTENSION_THRESHOLD;
    }
  }
// ...existing code...

  async submitQuiz() {
    if (!this.currentUser || this.levelId === null || this.subnivelId === null || this.quizCompleted) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Guardando tu progreso...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      this.currentScore = Math.floor(Math.random() * 100) + 1;
      this.quizCompleted = true;

      await this.dataService.updateProgresoSubnivel(
        this.currentUser.id,
        this.subnivelId,
        true,
        this.currentScore
      );
      await this.presentAlert('¡Quizz Completado!', `¡Has completado este quiz ("${this.gestureDetected}")! Tu puntaje: ${this.currentScore}.`);
      this.router.navigate(['/level-detail', this.levelId]);
    } catch (error: any) {
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