// src/app/pages/sublevel/sublevel.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';

import { AuthService } from '@services/auth.service';
import { DataService } from '@services/data.service';
import { Subnivel, SubnivelConProgreso } from '@services/data.service'; // Asumiendo que moviste las interfaces a data.service.ts o las importas de niveles.ts
import { User } from '@supabase/supabase-js';


@Component({
  selector: 'app-sublevel',
  templateUrl: './sublevel.page.html',
  styleUrls: ['./sublevel.page.scss'],
  standalone: false,
})
export class SublevelPage implements OnInit, OnDestroy {
  levelId: number | null = null;
  sublevelId: number | null = null;
  sublevelData: SubnivelConProgreso | null = null; // Contendrá el subnivel con su contenido JSON y progreso
  currentUser: User | null = null;

  isLoading: boolean = true;
  errorMessage: string | null = null;
  publicImageUrl: string | null = null; // Para la URL de la imagen si la hay

  private dataSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private dataService: DataService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.dataSubscription = this.authService.currentUser$.pipe(
      tap(user => {
        this.currentUser = user;
        if (!user) {
          this.isLoading = false;
          this.router.navigate(['/login']);
          throw new Error('Usuario no autenticado.');
        }
      }),
      switchMap(() => this.route.paramMap), // Escucha cambios en los params
      switchMap(async (params) => {
        const lId = params.get('levelId');
        const slId = params.get('sublevelId');

        if (!lId || !slId) {
          throw new Error('IDs de nivel o subnivel no encontrados en la ruta.');
        }
        this.levelId = +lId;
        this.sublevelId = +slId;
        console.log(`SublevelPage: Cargando subnivel ID ${this.sublevelId} del nivel ID ${this.levelId}`);
        if (!this.currentUser) throw new Error("Usuario se volvió nulo inesperadamente."); // No debería pasar
        return this.loadSublevelContent(this.sublevelId, this.currentUser.id);
      }),
      catchError(err => {
        console.error('SublevelPage: Error en la carga inicial:', err);
        if (err.message !== 'Usuario no autenticado.' && err.message !== 'IDs de nivel o subnivel no encontrados en la ruta.') {
          this.errorMessage = err.message || 'Error al cargar datos del subnivel.';
        }
        this.isLoading = false;
        return [];
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.dataSubscription?.unsubscribe();
  }

  async loadSublevelContent(sublevelId: number, userId: string) {
    const loading = await this.loadingCtrl.create({ message: 'Cargando actividad...' });
    await loading.present();
    this.errorMessage = null;
    this.publicImageUrl = null; // Limpiar imagen previa
    this.sublevelData = null;   // Limpiar datos previos

    try {
      this.sublevelData = await this.dataService.getSublevelByIdWithProgress(sublevelId, userId);

      if (!this.sublevelData) {
        this.errorMessage = `Subnivel con ID ${sublevelId} no encontrado.`;
      } else {
        console.log('SublevelPage: Datos del subnivel cargados:', JSON.stringify(this.sublevelData, null, 2));

        // Si el contenido tiene una imagenUrl y usas Supabase Storage:
        if (this.sublevelData.contenido?.imagenUrl && typeof this.sublevelData.contenido.imagenUrl === 'string') {
          const imagePath = this.sublevelData.contenido.imagenUrl;
          const BUCKET_NAME = 'niveluno'; // Nombre correcto de tu bucket

          console.log(`SublevelPage: Intentando obtener URL pública para: Bucket='${BUCKET_NAME}', Path='${imagePath}'`);

          // ---- CORRECCIÓN AQUÍ ----
          try {
            const { data } = this.authService.supabase.storage // 'getPublicUrl' no devuelve 'error'
              .from(BUCKET_NAME)
              .getPublicUrl(imagePath);

            if (data && data.publicUrl) {
              this.publicImageUrl = data.publicUrl;
              console.log('SublevelPage: URL pública de la imagen obtenida:', this.publicImageUrl);
            } else {
              // Esto puede pasar si el path es inválido de una forma que getPublicUrl no puede manejar,
              // o si la respuesta de Supabase es inesperada.
              console.error(`SublevelPage: No se pudo obtener la URL pública (data o data.publicUrl es null/undefined). Bucket: ${BUCKET_NAME}, Path: ${imagePath}.`);
              this.publicImageUrl = null;
              // Podrías añadir un mensaje a errorMessage si la imagen es vital.
              // this.errorMessage = (this.errorMessage ? this.errorMessage + " " : "") + "No se pudo generar la URL de la imagen.";
            }
          } catch (storageConstructionError: any) {
            // Este catch es para errores en la construcción de la URL de Storage en sí (raro si el path es un string simple)
            console.error('SublevelPage: Error construyendo la URL pública de Supabase Storage:', storageConstructionError);
            this.publicImageUrl = null;
            this.errorMessage = (this.errorMessage ? this.errorMessage + " " : "") + `Error con la URL de imagen: ${storageConstructionError.message}`;
          }
          // -------------------------

        } else {
          console.log('SublevelPage: No hay imagenUrl en el contenido del subnivel o no es un string.');
          this.publicImageUrl = null;
        }
      }
    } catch (error: any) { // Error de dataService.getSublevelByIdWithProgress
      console.error('SublevelPage: Error cargando contenido del subnivel:', error);
      this.errorMessage = `Error al cargar la actividad: ${error?.message || 'Error desconocido'}`;
    } finally {
      this.isLoading = false;
      loading.dismiss();
    }
  }

  // Lógica para manejar la respuesta del quiz (ejemplo)
  async manejarRespuestaQuiz(opcionSeleccionada: any) {
    if (!this.sublevelData || !this.sublevelData.contenido || !this.currentUser || !this.levelId) return;

    const esCorrecta = opcionSeleccionada.esCorrecta; // Asumiendo que tu objeto 'opcion' tiene 'esCorrecta'
    let feedback = esCorrecta ? this.sublevelData.contenido.feedbackCorrecto : this.sublevelData.contenido.feedbackIncorrecto;
    feedback = feedback || (esCorrecta ? "¡Correcto!" : "Intenta de nuevo.");

    await this.presentAlert(esCorrecta ? '¡Bien Hecho!' : 'Respuesta Incorrecta', feedback);

    if (esCorrecta && !this.sublevelData.usuario_completado) {
      // Marcar como completado (y posiblemente actualizar puntaje)
      // El trigger en la BD se encargará de desbloquear el siguiente nivel si aplica
      try {
        await this.dataService.updateProgresoSubnivel(
          this.currentUser.id,
          this.sublevelData.id,
          true, // completado
          100 // puntaje de ejemplo
        );
        this.sublevelData.usuario_completado = true; // Actualizar UI local
        this.sublevelData.usuario_puntaje = 100;
        // Quizás quieras navegar al siguiente subnivel o de vuelta a la lista
      } catch(error: any) {
        await this.presentAlert('Error', 'No se pudo guardar tu progreso: ' + error.message);
      }
    }
  }
async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }

  goBack() {
    // Navegar de vuelta a la lista de subniveles de LevelDetailPage
    if (this.levelId) {
      this.router.navigate(['/level-detail', this.levelId]);
    } else {
      this.navCtrl.back(); // Fallback genérico
    }
  }

  retryLoad() {
      if (this.sublevelId && this.currentUser) {
          this.loadSublevelContent(this.sublevelId, this.currentUser.id);
      }
  }
}
