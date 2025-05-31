import { Injectable } from '@angular/core';
import { Hands, HAND_CONNECTIONS, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

@Injectable({
  providedIn: 'root',
})
export class GestureDetectionService {
  private hands: Hands | null = null;
  private camera: Camera | null = null;
  private onResultsCallback: ((results: Results) => void) | null = null; // Para guardar el callback original

  constructor() {}

  initialize(videoElement: HTMLVideoElement, onResultsCallback: (results: Results) => void) {
    console.log('GestureDetectionService: Iniciando MediaPipe Hands y Cámara...');
    this.onResultsCallback = onResultsCallback; // Almacenar el callback original del componente

    this.hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    this.hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1, // 0 para modelo ligero, 1 para modelo más preciso
      minDetectionConfidence: 0.7, // Confianza mínima para que se detecte una mano
      minTrackingConfidence: 0.7, // Confianza mínima para seguir una mano ya detectada
    });

    // Envolver el callback original para añadir logging interno del servicio
    this.hands.onResults((results: Results) => {
      // console.log('GestureDetectionService: hands.onResults llamado por MediaPipe.'); // Demasiado verbose, descomentar solo si sospechas que no se llama nada
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        console.log('GestureDetectionService: ¡MANOS DETECTADAS por MediaPipe! Cantidad:', results.multiHandLandmarks.length);
        // Aquí puedes inspeccionar results.multiHandLandmarks[0] para ver las coordenadas
        // console.log('Coordenadas de la primera mano:', results.multiHandLandmarks[0]);
      } else {
        // console.log('GestureDetectionService: No se detectaron manos en el frame actual.');
      }
      if (this.onResultsCallback) {
        this.onResultsCallback(results); // Llamar al callback original de QuizUnoPage
      }
    });

    // Inicializar la cámara con configuraciones explícitas
    this.camera = new Camera(videoElement, {
      onFrame: async () => {
        // console.log('GestureDetectionService: onFrame - enviando imagen a MediaPipe Hands...'); // Muy verbose, descomentar si sospechas que no se envían frames
        await this.hands!.send({ image: videoElement });
      },
      width: 640, // Resolución del stream de video (ajustar si es necesario)
      height: 480,
      facingMode: 'user' // 'user' para cámara frontal (selfie), 'environment' para trasera
    });

    // Iniciar la cámara y manejar errores
    this.camera.start().then(() => {
      console.log('GestureDetectionService: Cámara iniciada con éxito. Verificando stream...');
      // Verificar si el elemento de video está realmente reproduciendo
      videoElement.onplaying = () => console.log('GestureDetectionService: Elemento de video está reproduciendo el stream de la cámara.');
      videoElement.onerror = (e) => console.error('GestureDetectionService: ERROR en el elemento de video:', e);

      // Una pequeña espera para asegurar que el stream se establezca visualmente
      setTimeout(() => {
        if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA || videoElement.readyState === videoElement.HAVE_FUTURE_DATA) {
          console.log('GestureDetectionService: El elemento de video tiene datos. ¡Debería verse la cámara!');
        } else {
          console.warn('GestureDetectionService: El elemento de video aún no tiene suficientes datos. ¿Cámara en negro?');
        }
      }, 1000); // Dar un segundo para que el video cargue

    }).catch(error => {
      console.error('GestureDetectionService: ERROR al iniciar la cámara:', error);
      if (error.name === "NotAllowedError") {
        console.error("GestureDetectionService: Permiso de cámara denegado. Por favor, otorga acceso a la cámara a la aplicación.");
        // Aquí podrías mostrar una alerta al usuario explicando el problema de permisos
      } else if (error.name === "NotFoundError") {
        console.error("GestureDetectionService: No se encontró una cámara en el dispositivo.");
      } else {
        console.error("GestureDetectionService: Error de cámara desconocido:", error);
      }
    });
  }

  stop() {
    console.log('GestureDetectionService: Deteniendo cámara y cerrando MediaPipe Hands.');
    this.camera?.stop();
    this.hands?.close();
    this.onResultsCallback = null;
  }
}
