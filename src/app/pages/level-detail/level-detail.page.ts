// src/app/pages/level-detail/level-detail.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { NavController, AlertController, LoadingController } from '@ionic/angular';

// --- Servicios y Tipos ---
import { AuthService } from '@services/auth.service';
// Asegúrate que las interfaces se importen correctamente, incluyendo ProgresoQuizzFinal
import { DataService, Nivel, SubnivelConProgreso, ProgresoQuizzFinal } from '@services/data.service';

import { User } from '@supabase/supabase-js';

// Define una interfaz para el subnivel del quizz final local
// Extiende SubnivelConProgreso para asegurar compatibilidad y añade la bandera 'isFinalQuizz'
interface QuizzFinalSubnivel extends SubnivelConProgreso {
  isFinalQuizz: true; // Esta propiedad será 'true' solo para el quizz final local
}

@Component({
  selector: 'app-level-detail',
  templateUrl: './level-detail.page.html',
  styleUrls: ['./level-detail.page.scss'],
  standalone: false,
})
export class LevelDetailPage implements OnInit, OnDestroy {
  levelId: number | null = null;
  levelDetails: Nivel | null = null; // Para mostrar info del nivel padre
  // El array subniveles ahora puede contener tanto SubnivelConProgreso como QuizzFinalSubnivel
  subniveles: (SubnivelConProgreso | QuizzFinalSubnivel)[] = [];
  currentUser: User | null = null;

  isLoading: boolean = true;
  errorMessage: string | null = null;

  private dataLoadSubscription: Subscription | null = null;

  // Definición de una plantilla para el subnivel del quizz final local
  // Omitimos algunas propiedades que serán completadas al momento de crear el objeto
  readonly FINAL_QUIZZ_SUBLEVEL_TEMPLATE: Omit<QuizzFinalSubnivel, 'id' | 'nivel_id' | 'contenido' | 'created_at'> & { localId: string } = {
    localId: 'quizz-final-local', // Un ID único para este subnivel local (no de la DB)
    nombre: 'Quizz Final del Nivel',
    numero_subnivel: 9999, // Un número alto para que aparezca al final de la lista
    usuario_completado: false, // Será sobreescrito por el progreso de la DB
    usuario_puntaje: null,     // Será sobreescrito por el progreso de la DB
    isFinalQuizz: true,        // La bandera que lo identifica
  };


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
    this.dataLoadSubscription = this.authService.currentUser$.pipe(
      tap(user => {
        this.currentUser = user;
        if (!user) {
          console.log('LevelDetailPage: No hay usuario, redirigiendo a login...');
          this.isLoading = false;
          this.router.navigate(['/login']);
          throw new Error('Usuario no autenticado.');
        }
      }),
      switchMap(user => {
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
        if (err.message !== 'Usuario no autenticado.' && err.message !== 'ID de nivel no encontrado.') {
            this.errorMessage = err.message || 'Error al cargar datos del nivel.';
        }
        this.isLoading = false;
        return [];
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
      const [levelDetailsData, subnivelesConProgresoData] = await Promise.all([
        this.dataService.getNivelDetails(levelId),
        this.dataService.getSubnivelesWithProgress(levelId, userId)
      ]);

      if (!levelDetailsData) {
        this.errorMessage = `No se encontraron detalles para el nivel con ID: ${levelId}. Puede que no exista o no tengas acceso.`;
      } else {
        this.levelDetails = levelDetailsData;
        console.log('LevelDetailPage: Detalles del nivel cargados:', this.levelDetails);
      }

      // Inicializa la lista con los subniveles de la base de datos
      this.subniveles = subnivelesConProgresoData || [];
      console.log('LevelDetailPage: Subniveles con progreso cargados:', this.subniveles);

      // --- Lógica para el Quizz Final, ahora con estado de la DB ---
      // 1. Determinar si todos los subniveles de la DB están completados
      // Si no hay subniveles de la DB, asumimos que no se puede desbloquear el quizz final.
      const allDbSubnivelesCompleted = this.subniveles.length > 0 && this.subniveles.every(sub => sub.usuario_completado);

      // 2. Si todos los subniveles de la DB están completados, añade el quizz final local
      if (allDbSubnivelesCompleted) {
        // Obtener el progreso del quizz final desde la nueva tabla
        const progresoQuizzFinal = await this.dataService.getProgresoQuizzFinal(levelId, userId);

        const finalQuizz: QuizzFinalSubnivel = {
          // Propiedades base del template
          id: this.FINAL_QUIZZ_SUBLEVEL_TEMPLATE.localId as unknown as number, // Cast a number para Subnivel.id
          nivel_id: levelId,
          nombre: this.FINAL_QUIZZ_SUBLEVEL_TEMPLATE.nombre,
          numero_subnivel: this.FINAL_QUIZZ_SUBLEVEL_TEMPLATE.numero_subnivel,
          contenido: null, // El quizz final no tiene contenido de subnivel
          created_at: new Date().toISOString(), // O la fecha que consideres para este objeto local
          isFinalQuizz: true,

          // Estado de completado y puntaje desde la DB
          usuario_completado: progresoQuizzFinal?.completado || false,
          usuario_puntaje: progresoQuizzFinal?.puntaje ?? null,
        };

        // Verifica si el quizz final ya está en la lista para evitar duplicados al recargar
        const quizzAlreadyAdded = this.subniveles.some(sub => (sub as QuizzFinalSubnivel).isFinalQuizz);

        if (!quizzAlreadyAdded) {
          this.subniveles.push(finalQuizz);
          console.log('LevelDetailPage: Quizz Final local añadido con estado de DB.');
        } else {
          // Si ya está añadido, actualiza su estado (útil si se completa y se recarga la página)
          const existingQuizzIndex = this.subniveles.findIndex(sub => (sub as QuizzFinalSubnivel).isFinalQuizz);
          if (existingQuizzIndex !== -1) {
            this.subniveles[existingQuizzIndex] = finalQuizz;
            console.log('LevelDetailPage: Estado del Quizz Final local actualizado.');
          }
        }
      }

      // 3. Ordenar los subniveles para asegurar que el quizz final esté al final
      this.subniveles.sort((a, b) => a.numero_subnivel - b.numero_subnivel);

    } catch (error: any) {
      console.error('LevelDetailPage: Error cargando datos del nivel y subniveles:', error);
      this.errorMessage = `Error al cargar el contenido del nivel: ${error?.message || 'Error desconocido'}`;
    } finally {
      this.isLoading = false;
      loadingIndicator.dismiss();
    }
  }

  // Método para cuando un usuario completa un subnivel (existente)
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
      // Vuelve a cargar los datos para reflejar el cambio y el posible desbloqueo del quizz final.
      await this.loadLevelAndSublevelData(this.levelDetails.idnivel, this.currentUser.id);
    } catch (error: any) {
      console.error('Error al completar subnivel:', error);
      await this.presentAlert('Error', `No se pudo completar el subnivel: ${error?.message || 'Error desconocido'}`);
    } finally {
      loading.dismiss();
    }
  }

  // Método para navegar a la página de un subnivel específico o al quizz final
  irASubnivel(subnivel: (SubnivelConProgreso | QuizzFinalSubnivel)) {
    if (!this.levelDetails || !this.currentUser) {
      console.error("No hay detalles del nivel padre o usuario para navegar al subnivel.");
      this.presentAlert('Error', 'No se puede navegar. Faltan datos del nivel o usuario.');
      return;
    }

    // Comprueba si es el subnivel del quizz final local
    if ((subnivel as QuizzFinalSubnivel).isFinalQuizz) {
      console.log(`Navegando al Quizz Final del Nivel ID: ${this.levelDetails.idnivel}`);
      // Navega a tu página 'quiz-uno', pasando el ID del nivel
      this.router.navigate(['/quiz-uno', this.levelDetails.idnivel]);
    } else {
      // Navegación existente para subniveles de la base de datos
      console.log(`Navegando al subnivel ID: ${subnivel.id} del Nivel ID: ${this.levelDetails.idnivel}`);
      this.router.navigate([
        '/level-detail',
        this.levelDetails.idnivel, // levelId
        'sublevel',
        subnivel.id // sublevelId
      ]);
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

  async showLoading(message: string = 'Cargando...') {
    const loading = await this.loadingController.create({
      message,
      spinner: 'crescent',
    });
    await loading.present();
    return loading;
  }

  goBack() {
    this.navCtrl.back();
  }

  retryLoadData() {
      if (this.levelId && this.currentUser) {
          this.isLoading = true;
          this.loadLevelAndSublevelData(this.levelId, this.currentUser.id);
      } else {
          this.presentAlert('Error', 'No hay información suficiente para reintentar la carga.');
          this.router.navigate(['/home']);
      }
  }
}
