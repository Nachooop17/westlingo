import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { GestureDetectionService } from 'src/app/services/gesture-detection.service';

@Component({
  selector: 'app-modulo-local-1',
  templateUrl: './modulo-local-1.page.html',
  styleUrls: ['./modulo-local-1.page.scss'],
  standalone : false,

})
export class ModuloLocal1Page implements OnInit, OnDestroy {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  gestureDetected: string = '';
  private previousFingerState: boolean = false; // Para rastrear el estado de los dedos

  constructor(private gestureService: GestureDetectionService) {}

  ngOnInit() {
    console.log('ModuloLocal1Page: Componente cargado');
    this.gestureService.initialize(this.videoElement.nativeElement, this.onResults.bind(this));
  }

  ngOnDestroy() {
    this.gestureService.stop();
  }

  onResults(results: any) {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];

      // Detectar el gesto "adiós"
      const isGoodbyeGesture = this.detectGoodbyeGesture(landmarks);
      if (isGoodbyeGesture) {
        this.gestureDetected = 'Adiós';
        console.log('Gesto detectado: Adiós');
      } else {
        this.gestureDetected = '';
      }
    }
  }

  detectGoodbyeGesture(landmarks: any): boolean {
    // Verifica si la palma está hacia afuera
    const palmFacingOut = landmarks[0].z < landmarks[9].z;

    // Verifica si los dedos están extendidos
    const fingersExtended =
      landmarks[8].y < landmarks[6].y && // Dedo índice
      landmarks[12].y < landmarks[10].y && // Dedo medio
      landmarks[16].y < landmarks[14].y && // Dedo anular
      landmarks[20].y < landmarks[18].y; // Dedo meñique

    // Detecta el movimiento de abrir y cerrar la mano
    const isHandClosing = landmarks[8].y > landmarks[6].y; // Índice doblado
    const isHandOpening = landmarks[8].y < landmarks[6].y; // Índice extendido

    if (palmFacingOut && fingersExtended) {
      if (isHandClosing && !this.previousFingerState) {
        this.previousFingerState = true;
        return true;
      } else if (isHandOpening && this.previousFingerState) {
        this.previousFingerState = false;
        return true;
      }
    }

    return false;
  }
}