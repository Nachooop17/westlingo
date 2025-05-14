import { Injectable } from '@angular/core';
import { Hands, HAND_CONNECTIONS, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

@Injectable({
  providedIn: 'root',
})
export class GestureDetectionService {
  private hands: Hands | null = null;
  private camera: Camera | null = null;

  constructor() {}

  initialize(videoElement: HTMLVideoElement, onResultsCallback: (results: Results) => void) {
    this.hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    this.hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    this.hands.onResults(onResultsCallback);

    this.camera = new Camera(videoElement, {
      onFrame: async () => {
        await this.hands!.send({ image: videoElement });
      },
    });

    this.camera.start();
  }

  stop() {
    this.camera?.stop();
    this.hands?.close();
  }
}