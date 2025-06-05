import { Injectable } from '@angular/core';
import { Hands, Results as HandsResults } from '@mediapipe/hands';
import { FaceMesh, Results as FaceResults } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

@Injectable({
  providedIn: 'root',
})
export class GestureDetectionService {
  private hands: Hands | null = null;
  private faceMesh: FaceMesh | null = null;
  private camera: Camera | null = null;
  private onHandsResultsCallback: ((results: HandsResults) => void) | null = null;
  private onFaceResultsCallback: ((results: FaceResults) => void) | null = null;

  constructor() {}

  initialize(
    videoElement: HTMLVideoElement,
    onHandsResultsCallback: (results: HandsResults) => void,
    onFaceResultsCallback: (results: FaceResults) => void
  ) {
    // Hands
    this.onHandsResultsCallback = onHandsResultsCallback;
    this.hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    this.hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });
    this.hands.onResults((results: HandsResults) => {
      if (this.onHandsResultsCallback) this.onHandsResultsCallback(results);
    });

    // FaceMesh
    this.onFaceResultsCallback = onFaceResultsCallback;
    this.faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });
    this.faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: false,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });
    this.faceMesh.onResults((results: FaceResults) => {
      if (this.onFaceResultsCallback) this.onFaceResultsCallback(results);
    });

    // Cámara
    this.camera = new Camera(videoElement, {
      onFrame: async () => {
        await this.hands!.send({ image: videoElement });
        await this.faceMesh!.send({ image: videoElement });
      },
      width: 640,
      height: 480,
      facingMode: 'user'
    });

    this.camera.start().catch(console.error);
  }

  stop() {
    this.camera?.stop();
    this.hands?.close();
    this.faceMesh?.close();
    this.onHandsResultsCallback = null;
    this.onFaceResultsCallback = null;
  }
}