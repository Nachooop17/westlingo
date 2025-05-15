// src/app/pages/modulo-local-1/modulo-local-1.page.ts
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { GestureDetectionService } from 'src/app/services/gesture-detection.service'; // Asegúrate que la ruta es correcta

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
  selector: 'app-modulo-local-1',
  templateUrl: './modulo-local-1.page.html',
  styleUrls: ['./modulo-local-1.page.scss'],
  standalone: false,
})
export class ModuloLocal1Page implements OnInit, OnDestroy {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  gestureDetected: string = '';

  // --- Propiedades para detección de "adiós" ---
  private wristXHistory: number[] = []; // Historial de posiciones X de la muñeca
  private readonly WAVE_HISTORY_LENGTH = 15; // Cuántos frames de historial
  private readonly WAVE_X_THRESHOLD = 0.08;  // Umbral de movimiento en X (normalizado, ajusta según pruebas)
  private readonly MIN_WAVES_DETECTED = 2;   // Cuántos cambios de dirección para considerar un "adiós"
  
  private waveDirectionChanges: number = 0;
  private lastWaveDirection: 'LEFT' | 'RIGHT' | 'NONE' = 'NONE';
  private lastSignificantX: number | null = null;
  private waveDetectionTimeout: any = null;
  // -----------------------------------------

  constructor(
    private gestureService: GestureDetectionService,
    private ngZone: NgZone // Para actualizar la UI desde callbacks de MediaPipe
  ) {}

  ngOnInit() {
    console.log('ModuloLocal1Page: Componente cargado');
    // Asegúrate que el elemento de video esté disponible
    if (this.videoElement && this.videoElement.nativeElement) {
      this.gestureService.initialize(this.videoElement.nativeElement, this.onResults.bind(this));
    } else {
      console.error('ModuloLocal1Page: videoElement no está disponible en ngOnInit.');
    }
  }

  ngOnDestroy() {
    this.gestureService.stop();
    if (this.waveDetectionTimeout) {
      clearTimeout(this.waveDetectionTimeout);
    }
  }

  onResults(results: any) {
    this.ngZone.run(() => { // Ejecutar dentro de NgZone para actualizar la UI
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0]; // Considerar solo la primera mano

        const isGoodbyeGesture = this.detectGoodbyeWave(landmarks);

        if (isGoodbyeGesture) {
          if (this.gestureDetected !== 'Adiós') { // Evitar logs repetitivos si ya se detectó
            this.gestureDetected = 'Adiós';
            console.log('GESTO DETECTADO: Adiós');
            // Resetea después de una detección exitosa para permitir nuevas detecciones
            this.resetWaveDetection();
          }
        } else {
          // Si no es "adiós", podrías querer limpiar gestureDetected
          // o manejar otros gestos. Por ahora, lo mantenemos si ya se detectó una vez
          // hasta que el timeout lo resetee o se detecte otro gesto.
          // Para una detección continua, podrías limpiar this.gestureDetected aquí si no es adiós.
        }
      } else {
        // No se detectan manos, resetea el estado de "adiós" si es necesario
        if (this.gestureDetected === 'Adiós' || this.waveDirectionChanges > 0) {
           // Si no hay manos, y estábamos en proceso de detectar un adiós, reseteamos.
           // console.log("No se detectan manos, reseteando detección de adiós");
           // this.resetWaveDetection(); // Podrías resetear aquí o depender del timeout
        }
        this.gestureDetected = '';
      }
    });
  }

  areFingersGenerallyExtended(landmarks: any): boolean {
    // Verifica si los dedos (índice, medio, anular, meñique) están más extendidos que flexionados
    // Compara la coordenada Y de la punta (TIP) con la base del dedo (MCP)
    // Asume que una Y menor significa "más arriba" = más extendido, si la mano está vertical
    // Esta lógica es sensible a la orientación de la mano.
    const indexFingerExtended = landmarks[HandLandmark.INDEX_FINGER_TIP].y < landmarks[HandLandmark.INDEX_FINGER_MCP].y;
    const middleFingerExtended = landmarks[HandLandmark.MIDDLE_FINGER_TIP].y < landmarks[HandLandmark.MIDDLE_FINGER_MCP].y;
    const ringFingerExtended = landmarks[HandLandmark.RING_FINGER_TIP].y < landmarks[HandLandmark.RING_FINGER_MCP].y;
    const pinkyFingerExtended = landmarks[HandLandmark.PINKY_TIP].y < landmarks[HandLandmark.PINKY_MCP].y;

    // Podríamos requerir que al menos 3 de 4 dedos estén extendidos
    const extendedFingersCount = [indexFingerExtended, middleFingerExtended, ringFingerExtended, pinkyFingerExtended]
                                  .filter(isExtended => isExtended).length;
    return extendedFingersCount >= 3; // Al menos 3 dedos extendidos
  }

  detectGoodbyeWave(landmarks: any): boolean {
    if (!this.areFingersGenerallyExtended(landmarks)) {
      // Si los dedos no están extendidos, es poco probable que sea un saludo de este tipo.
      // Podrías resetear aquí si el estado de los dedos es un pre-requisito.
      // this.resetWaveDetection();
      return false;
    }

    const wristX = landmarks[HandLandmark.WRIST].x;

    // Inicializar lastSignificantX si es la primera vez o después de un reset
    if (this.lastSignificantX === null) {
      this.lastSignificantX = wristX;
      this.wristXHistory = [wristX]; // Iniciar historial
      return false;
    }

    this.wristXHistory.push(wristX);
    if (this.wristXHistory.length > this.WAVE_HISTORY_LENGTH) {
      this.wristXHistory.shift(); // Mantener el historial con una longitud fija
    }
    
    // Calcular el promedio de las últimas N posiciones para suavizar el movimiento
    const avgX = this.wristXHistory.reduce((acc, val) => acc + val, 0) / this.wristXHistory.length;
    const movementDelta = avgX - this.lastSignificantX;

    // Establecer un timeout para resetear la detección si no hay movimiento continuo
    if (this.waveDetectionTimeout) {
      clearTimeout(this.waveDetectionTimeout);
    }
    this.waveDetectionTimeout = setTimeout(() => {
      // console.log("Timeout, reseteando detección de adiós");
      this.resetWaveDetection();
    }, 800); // Resetea después de 800ms de inactividad o no detección

    if (Math.abs(movementDelta) > this.WAVE_X_THRESHOLD) {
      const currentDirection = movementDelta > 0 ? 'RIGHT' : 'LEFT';
      // console.log(`Movimiento detectado: ${currentDirection}, Delta: ${movementDelta.toFixed(3)}, Estado anterior: ${this.lastWaveDirection}, Cambios: ${this.waveDirectionChanges}`);

      if (this.lastWaveDirection !== 'NONE' && this.lastWaveDirection !== currentDirection) {
        this.waveDirectionChanges++;
        // console.log(`Cambio de dirección! Total cambios: ${this.waveDirectionChanges}`);
      }
      
      this.lastWaveDirection = currentDirection;
      this.lastSignificantX = avgX; // Actualizar el punto de referencia para el próximo movimiento significativo

      if (this.waveDirectionChanges >= this.MIN_WAVES_DETECTED) {
        // console.log("Umbral de cambios de dirección alcanzado!");
        // No resetear inmediatamente, permite que el log "GESTO DETECTADO: Adiós" se muestre.
        // El reseteo se manejará en onResults o por el timeout.
        return true;
      }
    }
    return false;
  }

  resetWaveDetection() {
    // console.log("Wave detection reset.");
    this.wristXHistory = [];
    this.waveDirectionChanges = 0;
    this.lastWaveDirection = 'NONE';
    this.lastSignificantX = null;
    if (this.waveDetectionTimeout) {
      clearTimeout(this.waveDetectionTimeout);
      this.waveDetectionTimeout = null;
    }
    // Podrías querer limpiar this.gestureDetected aquí también si es apropiado
    // if (this.gestureDetected === 'Adiós') {
    //   this.gestureDetected = '';
    // }
  }
}