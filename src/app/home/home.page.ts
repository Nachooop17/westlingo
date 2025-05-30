// src/app/pages/home/home.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular'; // Importar NavController para ionViewWillEnter
import { Subscription } from 'rxjs';

// --- Importaciones Actualizadas ---
import { AuthService } from '@services/auth.service';
import { DataService, Nivel } from '@services/data.service'; // Asegúrate de importar Nivel desde data.service
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit, OnDestroy {
  niveles: Nivel[] = [];
  currentUser: User | null = null;
  isLoading: boolean = true;
  private userSubscription: Subscription | null = null;
  private levelProgressSubscription: Subscription | null = null; // Suscripción para el progreso de niveles en tiempo real

  modulosLocales = [
    {
      id: 'modulo1',
      nombre: 'Módulo Camara',
      descripcion: 'Modulo CAMARA PRUEBA .',
      ruta: '/modulo'
    }
  ];

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private alertController: AlertController,
    private navCtrl: NavController // Inyectar NavController
  ) {}

  ngOnInit() {
    // ngOnInit se usa para inicializar suscripciones que duran la vida del componente
    // La carga inicial de datos se moverá a ionViewWillEnter
    this.subscribeToUser(); 
  }

  // ionViewWillEnter se ejecuta cada vez que la página está a punto de volverse activa
  ionViewWillEnter() {
    console.log('HomePage: ionViewWillEnter - Recargando datos de niveles.');
    // Asegurarse de que el usuario esté disponible antes de cargar los niveles
    if (this.currentUser) {
      this.loadNivelesFromSupabase(this.currentUser.id);
      // También re-suscribirse al progreso de niveles si no lo está (o si se desuscribió en onDidLeave)
      this.subscribeToLevelProgress(this.currentUser.id);
    } else {
      // Si no hay usuario, y no estamos ya en la ruta de login, redirigir
      if (this.router.url !== '/login') {
        this.router.navigate(['/login']);
      }
    }
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
    this.levelProgressSubscription?.unsubscribe(); // Desuscribirse al destruir el componente
  }

  irAModuloLocal(ruta: string) {
    console.log(`Navegando a: ${ruta}`);
    this.router.navigate(['/modulo']).then(
      success => console.log('Navegación exitosa'),
      error => console.error('Error en la navegación:', error)
    );
  }

  subscribeToUser() {
    // Esta suscripción es para el estado de autenticación del usuario
    this.userSubscription = this.authService.currentUser$.subscribe({
      next: (user) => {
        if (user) {
          // Solo si el usuario cambia o es la primera vez que se detecta
          if (!this.currentUser || this.currentUser.id !== user.id) {
            console.log('HomePage: Usuario autenticado detectado - UID:', user.id);
            this.currentUser = user;
            // La carga de niveles inicial y la suscripción a progreso se manejan en ionViewWillEnter
          }
        } else {
          console.log('HomePage: No hay usuario autenticado, redirigiendo a login...');
          this.currentUser = null;
          this.isLoading = false;
          // Desuscribirse de todo lo relacionado con el usuario anterior
          this.levelProgressSubscription?.unsubscribe(); 
          if (this.router.url !== '/login') {
            this.router.navigate(['/login']);
          }
        }
      },
      error: (error) => {
          console.error('HomePage: Error en la suscripción a currentUser$:', error);
          this.isLoading = false;
          this.currentUser = null;
          this.levelProgressSubscription?.unsubscribe(); 
          this.router.navigate(['/login']);
      }
    });
  }

  /**
   * Suscribe a los cambios en tiempo real del progreso de niveles del usuario actual.
   * Se llama desde ionViewWillEnter para asegurar que la suscripción esté activa.
   */
  subscribeToLevelProgress(userId: string) {
    // Desuscribirse de cualquier suscripción anterior para evitar duplicados
    this.levelProgressSubscription?.unsubscribe(); 
    
    this.levelProgressSubscription = this.dataService.subscribeToUserLevelProgress(userId).subscribe({
      next: (payload) => {
        // Cuando hay un cambio en el progreso del nivel del usuario, recargar los niveles
        console.log('HomePage: Cambio en progreso de nivel detectado por Realtime API. Recargando niveles...');
        if (this.currentUser) {
          this.loadNivelesFromSupabase(this.currentUser.id);
        }
      },
      error: (err) => {
        console.error('HomePage: Error en la suscripción a progreso de niveles en tiempo real:', err);
      }
    });
  }

  async loadNivelesFromSupabase(userId: string) {
    console.log('HomePage: Cargando niveles desde Supabase...');
    this.isLoading = true;
    try {
      this.niveles = await this.dataService.getNivelesForUser(userId);
      console.log('HomePage: Niveles recuperados:', this.niveles);
    } catch (error: any) {
      console.error('HomePage: Error al cargar niveles:', error);
      await this.presentAlert('Error de Carga', `No se pudieron cargar los niveles: ${error?.message || 'Error desconocido'}`);
      this.niveles = [];
    } finally {
      this.isLoading = false;
    }
  }

  async ensureLevelOneAccessInSupabase(userId: string) {
    try {
      await this.dataService.updateNivelAccess(userId, 1, true);
      console.log('HomePage: Acceso asegurado para nivel 1.');
    } catch (error) {
      console.error('HomePage: Error asegurando acceso a nivel 1:', error);
    }
  }

  irANivel(nivelSeleccionado: Nivel) {
    if (!nivelSeleccionado?.acceso) {
      this.presentAlert('Acceso Bloqueado', 'Completa los niveles anteriores para desbloquear este.');
      return;
    }

    console.log(`HomePage: Navegando a level-detail con ID: ${nivelSeleccionado.idnivel}`);
    this.router.navigate(['/level-detail', nivelSeleccionado.idnivel]);
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
