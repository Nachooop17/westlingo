// src/app/pages/level-detail/level-detail.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { NavController, AlertController, LoadingController } from '@ionic/angular';

// --- Servicios y Tipos ---
import { AuthService } from '@services/auth.service';
import { DataService, Nivel, SubnivelConProgreso } from '@services/data.service';

import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-level-detail',
  templateUrl: './level-detail.page.html',
  styleUrls: ['./level-detail.page.scss'],
  // NO es standalone:
  standalone: false, // No es necesario especificar false, la ausencia de 'true' lo implica
  // NO array 'imports' aquí
})
export class LevelDetailPage implements OnInit, OnDestroy {
  levelId: number | null = null;
  levelDetails: Nivel | null = null; // Para mostrar info del nivel padre
  subniveles: SubnivelConProgreso[] = []; // Array para los subniveles
  currentUser: User | null = null;

  isLoading: boolean = true;
  errorMessage: string | null = null;

  private dataLoadSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private dataService: DataService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.isLoading = true;
    // Combinar la obtención del usuario y el parámetro de ruta para cargar datos
    this.dataLoadSubscription = this.authService.currentUser$.pipe(
      tap(user => {
        this.currentUser = user;
        if (!user) {
          console.log('LevelDetailPage: No hay usuario, redirigiendo a login...');
          this.isLoading = false;
          this.router.navigate(['/login']);
          throw new Error('Usuario no autenticado.'); // Detener el flujo del observable
        }
      }),
      switchMap(user => {
        // Si el user es null, el throw anterior detuvo la cadena.
        // Si llegamos aquí, user no es null.
        return this.route.paramMap;
      }),
      switchMap(async (params) => {
        const idParam = params.get('id');
        if (!idParam) {
          console.error('LevelDetailPage: No se encontró ID de nivel en la ruta.');
          this.errorMessage = 'ID de nivel no encontrado en la URL.';
          this.isLoading = false;
          throw new Error('ID de nivel no encontrado.');
        }
        this.levelId = +idParam;
        console.log('LevelDetailPage: Obtenido levelId:', this.levelId, 'para usuario UID:', this.currentUser!.id);
        return this.loadLevelAndSublevelData(this.levelId, this.currentUser!.id);
      }),
      catchError(err => {
        console.error('LevelDetailPage: Error en la cadena de carga inicial:', err);
        // No mostrar alerta si el error es por no estar autenticado, ya que se redirige.
        if (err.message !== 'Usuario no autenticado.' && err.message !== 'ID de nivel no encontrado.') {
            this.errorMessage = err.message || 'Error al cargar datos del nivel.';
        }
        this.isLoading = false;
        return []; // Devuelve un observable vacío o maneja el error como prefieras
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.dataLoadSubscription?.unsubscribe();
  }

  async loadLevelAndSublevelData(levelId: number, userId: string) {
    const loadingIndicator = await this.showLoading('Cargando contenido del nivel...');
    this.errorMessage = null; // Limpiar errores previos
    this.levelDetails = null; // Limpiar detalles previos
    this.subniveles = [];     // Limpiar subniveles previos

    try {
      console.log(`LevelDetailPage: Solicitando datos para nivel ${levelId}, usuario ${userId}`);
      // Cargar detalles del nivel principal y subniveles con progreso en paralelo
      const [levelDetailsData, subnivelesConProgresoData] = await Promise.all([
        this.dataService.getNivelDetails(levelId),
        this.dataService.getSubnivelesWithProgress(levelId, userId)
      ]);

      if (!levelDetailsData) {
        this.errorMessage = `No se encontraron detalles para el nivel con ID: ${levelId}. Puede que no exista o no tengas acceso.`;
        // Podrías redirigir o mostrar un mensaje más prominente
      } else {
        this.levelDetails = levelDetailsData;
        console.log('LevelDetailPage: Detalles del nivel cargados:', this.levelDetails);
      }

      this.subniveles = subnivelesConProgresoData || []; // Si es null/undefined, usa array vacío
      console.log('LevelDetailPage: Subniveles con progreso cargados:', this.subniveles);

      // Aquí ya tienes this.subniveles populado. Si está vacío, el template lo manejará.

    } catch (error: any) {
      console.error('LevelDetailPage: Error cargando datos del nivel y subniveles:', error);
      this.errorMessage = `Error al cargar el contenido del nivel: ${error?.message || 'Error desconocido'}`;
      // No es necesario llamar a presentAlert aquí si el template muestra errorMessage
    } finally {
      this.isLoading = false;
      loadingIndicator.dismiss();
    }
  }

  // Ejemplo: Método para cuando un usuario completa un subnivel
  async completarSubnivel(subnivel: SubnivelConProgreso, nuevoPuntaje?: number) {
    if (!this.currentUser || !this.levelDetails) {
      await this.presentAlert('Error', 'No se puede completar el subnivel sin información de usuario o nivel.');
      return;
    }

    const loading = await this.showLoading('Actualizando progreso...');
    try {
      await this.dataService.updateProgresoSubnivel(
        this.currentUser.id,
        subnivel.id,
        true, // completado = true
        nuevoPuntaje ?? subnivel.usuario_puntaje ?? 0
      );
      await this.presentAlert('¡Éxito!', `${subnivel.nombre} marcado como completado.`);
      // Vuelve a cargar los datos para reflejar el cambio y el posible desbloqueo
      // de un nuevo nivel (manejado por el trigger en la BD).
      await this.loadLevelAndSublevelData(this.levelDetails.idnivel, this.currentUser.id);
    } catch (error: any) {
      console.error('Error al completar subnivel:', error);
      await this.presentAlert('Error', `No se pudo completar el subnivel: ${error?.message || 'Error desconocido'}`);
    } finally {
      loading.dismiss();
    }
  }

  // Método para navegar a la página de un subnivel específico (deberás crear esta página)
  // src/app/pages/level-detail/level-detail.page.ts
// ...
  irASubnivel(subnivel: SubnivelConProgreso) {
    if (!this.levelDetails) {
      console.error("No hay detalles del nivel padre para navegar al subnivel.");
      return;
    }
    // No necesitas verificar 'acceso' al subnivel aquí, ya que la lista en LevelDetailPage
    // ya podría estar filtrada o el estado de completado es lo que importa para reintentar/ver.
    // La lógica de si puede o no interactuar estará en la SublevelPage.
    console.log(`Navegando al subnivel ID: ${subnivel.id} del Nivel ID: ${this.levelDetails.idnivel}`);
    this.router.navigate([
      '/level-detail',
      this.levelDetails.idnivel, // levelId
      'sublevel',
      subnivel.id               // sublevelId
    ]);
  }
// ...

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
      backdropDismiss: false
    });
    await alert.present();
  }

  async showLoading(message: string = 'Cargando...') {
    const loading = await this.loadingController.create({
      message,
      spinner: 'crescent',
    });
    await loading.present();
    return loading;
  }

  goBack() {
    this.navCtrl.back(); // Navegación hacia atrás
  }

  // Para el botón de reintentar en el template si hubo un error
  retryLoadData() {
      if (this.levelId && this.currentUser) {
          this.isLoading = true; // Activa el indicador de carga antes de reintentar
          this.loadLevelAndSublevelData(this.levelId, this.currentUser.id);
      } else {
          // Si no hay levelId o currentUser, quizá volver a home o login
          this.presentAlert('Error', 'No hay información suficiente para reintentar la carga.');
          this.router.navigate(['/home']);
      }
  }
}