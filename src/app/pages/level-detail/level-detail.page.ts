// src/app/pages/level-detail/level-detail.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // Importar RouterModule
import { CommonModule } from '@angular/common'; // Importar CommonModule para *ngIf y *ngFor
import { 
  NavController, 
  AlertController, 
  LoadingController,
  IonicModule // <--- IMPORTAR IonicModule AQUÍ para todos los componentes Ionic
} from '@ionic/angular'; 
import { Subscription } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';

// --- Servicios y Tipos ---
import { AuthService } from '@services/auth.service';
import { DataService, Nivel, SubnivelConProgreso } from '@services/data.service';

import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-level-detail',
  templateUrl: './level-detail.page.html',
  styleUrls: ['./level-detail.page.scss'],
  standalone: true, // <--- ESTO DEBE SER TRUE
  imports: [ // <--- TODAS LAS DEPENDENCIAS DEL TEMPLATE DEBEN IR AQUÍ
    CommonModule, // Para *ngIf, *ngFor
    RouterModule, // Para routerLink
    IonicModule // Para todos los componentes Ionic (ion-header, ion-content, ion-button, ion-icon, etc.)
  ]
})
export class LevelDetailPage implements OnInit, OnDestroy {
  levelId: number | null = null;
  levelDetails: Nivel | null = null;
  subniveles: SubnivelConProgreso[] = []; 
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
    this.errorMessage = null;
    this.levelDetails = null;
    this.subniveles = [];

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

      // 1. Procesar subniveles de la base de datos y establecer 'isUnlocked' para el acceso secuencial
      const processedSubniveles: SubnivelConProgreso[] = [];
      let previousSublevelCompleted = true; // El primer subnivel siempre está "desbloqueado" si el nivel es accesible.

      for (const sub of subnivelesConProgresoData || []) {
        const currentSub = { ...sub }; // Copia para no modificar el original
        currentSub.isUnlocked = previousSublevelCompleted; // Desbloqueado si el anterior se completó

        if (currentSub.usuario_completado) {
          previousSublevelCompleted = true; // Si este está completo, el siguiente se desbloquea
        } else {
          previousSublevelCompleted = false; // Si este no está completo, el siguiente se bloquea
        }
        processedSubniveles.push(currentSub);
      }
      this.subniveles = processedSubniveles;
      console.log('LevelDetailPage: Subniveles con progreso y estado de desbloqueo:', this.subniveles);

      // 2. Verificar si TODOS los subniveles de la DB están completados (para desbloquear el siguiente nivel principal)
      const allDbSubnivelesCompleted = this.subniveles.length > 0 && this.subniveles.every(sub => sub.usuario_completado);

      // --- LÓGICA DE DESBLOQUEO DEL SIGUIENTE NIVEL PRINCIPAL ---
      if (allDbSubnivelesCompleted) {
        const nextLevelId = levelId + 1;
        const allLevels = await this.dataService.getNivelesForUser(userId);
        const nextLevel = allLevels.find(n => n.idnivel === nextLevelId);

        if (nextLevel && !nextLevel.acceso) {
          console.log(`LevelDetailPage: Todos los subniveles de DB completados. Desbloqueando Nivel ${nextLevelId}.`);
          await this.dataService.updateNivelAccess(userId, nextLevelId, true);
          this.presentAlert('¡Nivel Desbloqueado!', `¡Felicidades! Has completado este nivel y desbloqueado el Nivel ${nextLevelId}.`);
        } else if (nextLevel && nextLevel.acceso) {
          console.log(`LevelDetailPage: Nivel ${nextLevelId} ya está desbloqueado.`);
        } else {
          console.log(`LevelDetailPage: No hay Nivel ${nextLevelId} para desbloquear o es el último nivel.`);
        }
      }

    } catch (error: any) {
      console.error('LevelDetailPage: Error cargando datos del nivel y subniveles:', error);
      this.errorMessage = `Error al cargar el contenido del nivel: ${error?.message || 'Error desconocido'}`;
    } finally {
      this.isLoading = false;
      loadingIndicator.dismiss();
    }
  }

  async completarSubnivel(subnivel: SubnivelConProgreso, nuevoPuntaje?: number) {
    if (!this.currentUser || !this.levelDetails) {
      await this.presentAlert('Error', 'No se puede completar el subnivel sin información de usuario o nivel.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Actualizando progreso...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      await this.dataService.updateProgresoSubnivel(
        this.currentUser.id,
        subnivel.id,
        true,
        nuevoPuntaje ?? subnivel.usuario_puntaje ?? 0
      );
      await this.presentAlert('¡Éxito!', `${subnivel.nombre} marcado como completado.`);
      await this.loadLevelAndSublevelData(this.levelDetails.idnivel, this.currentUser.id);
    } catch (error: any) {
      console.error('Error al completar subnivel:', error);
      await this.presentAlert('Error', `No se pudo completar el subnivel: ${error?.message || 'Error desconocido'}`);
    } finally {
      loading.dismiss();
    }
  }

  irASubnivel(subnivel: SubnivelConProgreso) {
    if (!this.levelDetails || !this.currentUser) {
      console.error("No hay detalles del nivel padre o usuario para navegar al subnivel.");
      this.presentAlert('Error', 'No se puede navegar. Faltan datos del nivel o usuario.');
      return;
    }

    if (!subnivel.isUnlocked) {
      this.presentAlert('Bloqueado', 'Completa las actividades anteriores para desbloquear esta.');
      return;
    }

    if (subnivel.tipo === 'quiz' && subnivel.pagina_quiz_local) {
      console.log(`Navegando al Subnivel Quiz ID: ${subnivel.id} (Página: ${subnivel.pagina_quiz_local})`);
      this.router.navigate(['/', subnivel.pagina_quiz_local, this.levelDetails.idnivel, subnivel.id]); 
    }
    else {
      console.log(`Navegando al Subnivel de Contenido ID: ${subnivel.id}`);
      this.router.navigate([
        '/level-detail',
        this.levelDetails.idnivel,
        'sublevel',
        subnivel.id
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
