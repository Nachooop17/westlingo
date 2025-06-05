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
  private readonly FINGER_EXTENSION_THRESHOLD = 0.05;

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
      this.gestureService.initialize(this.videoElement.nativeElement, this.onResults.bind(this));
    }
  }

  ngOnDestroy() {
    this.gestureService.stop();
  }

  /**
   * Verifica si hay una mano detectada.
   */
  isHandPresent(results: any): boolean {
    return results.multiHandLandmarks && results.multiHandLandmarks.length > 0;
  }

  /**
   * Verifica si solo el índice está extendido.
   */
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
    const thumbBent = !this.isFingerExtended(
      landmarks[HandLandmark.THUMB_TIP],
      landmarks[HandLandmark.THUMB_CMC],
      'THUMB'
    );
    return indexExtended && middleBent && ringBent && pinkyBent && thumbBent;
  }

  /**
   * Verifica si el índice está cerca de la barbilla (ajusta el umbral según tu cámara).
   */
  isIndexNearChin(landmarks: any): boolean {
    const indexY = landmarks[HandLandmark.INDEX_FINGER_TIP].y;
    const barbillaYThreshold = 0.65;
    return indexY < barbillaYThreshold;
  }

  /**
   * Utilidad para saber si un dedo está extendido.
   */
  isFingerExtended(tip: any, mcp: any, finger: string): boolean {
    if (finger === 'THUMB') {
      return Math.abs(tip.x - mcp.x) > this.FINGER_EXTENSION_THRESHOLD;
    } else {
      return (mcp.y - tip.y) > this.FINGER_EXTENSION_THRESHOLD;
    }
  }

  /**
   * Procesa los resultados de MediaPipe y detecta el gesto "¿quién?" paso a paso.
   */
  onResults(results: any) {
    this.ngZone.run(() => {
      if (!this.isHandPresent(results)) {
        this.gestureDetected = '';
        return;
      }
      const landmarks = results.multiHandLandmarks[0];
      console.log('Mano detectada');

      if (!this.isOnlyIndexFingerExtended(landmarks)) {
        this.gestureDetected = '';
        console.log('No hay solo un dedo (índice) extendido');
        return;
      }
      console.log('Índice extendido y demás dedos doblados');

      if (!this.isIndexNearChin(landmarks)) {
        this.gestureDetected = '';
        console.log('Índice no está cerca de la barbilla');
        return;
      }
      console.log('Índice cerca de la barbilla');

      if (this.gestureDetected !== '¿Quién?') {
        this.gestureDetected = '¿Quién?';
        console.log('QuizDosPage: GESTO DETECTADO: ¿Quién?');
        if (!this.quizCompleted) {
          this.submitQuiz();
        }
      }
    });
  }

  /**
   * Completa el quiz (solo guarda su progreso, NO desbloquea el siguiente nivel).
   */
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
      await this.presentAlert('¡Quizz Completado!', `¡Has completado este quiz! Tu puntaje: ${this.currentScore}.`);
      this.router.navigate(['/level-detail', this.levelId]);
    } catch (error: any) {
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