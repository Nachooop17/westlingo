// src/app/pages/home/home.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

// --- Importaciones Actualizadas ---
import { AuthService } from '@services/auth.service';
import { DataService } from '@services/data.service';
import { Nivel } from '@services/niveles';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false // Correcto para no ser standalone
  // No hay array 'imports' aquí
})
export class HomePage implements OnInit, OnDestroy {
  niveles: Nivel[] = [];
  currentUser: User | null = null;
  isLoading: boolean = true;
  private userSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.subscribeToUser();
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  subscribeToUser() {
    this.isLoading = true;
    this.niveles = [];
    this.userSubscription = this.authService.currentUser$.subscribe({
      next: (user) => {
        if (user) {
          if (!this.currentUser || this.currentUser.id !== user.id) {
            console.log('HomePage: Usuario autenticado detectado - UID:', user.id);
            this.currentUser = user;
            this.loadNivelesFromSupabase(this.currentUser.id);
            // La llamada a ensureLevelOneAccessInSupabase aquí es opcional/respaldo,
            // ya que el trigger de BD debería manejarlo al crear el usuario.
            // this.ensureLevelOneAccessInSupabase(this.currentUser.id);
          } else {
            this.isLoading = false; // Mismo usuario, solo termina la carga
          }
        } else {
          console.log('HomePage: No hay usuario autenticado, redirigiendo a login...');
          this.currentUser = null;
          this.isLoading = false;
          if (this.router.url !== '/login') {
            this.router.navigate(['/login']);
          }
        }
      },
      error: (error) => {
         console.error('HomePage: Error en la suscripción a currentUser$:', error);
         this.isLoading = false;
         this.currentUser = null;
         this.router.navigate(['/login']);
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

  // Opcional: si el trigger no fuera suficiente o como respaldo.
  async ensureLevelOneAccessInSupabase(userId: string) {
    try {
      // Asumiendo que el nivel con numero_nivel 1 tiene id=1 en tu tabla 'niveles'
      await this.dataService.updateNivelAccess(userId, 1, true);
      console.log('HomePage: Acceso asegurado para nivel 1.');
    } catch (error) {
      console.error('HomePage: Error asegurando acceso a nivel 1:', error);
    }
  }

  // --- MÉTODO irANivel CORREGIDO ---
  irANivel(nivelSeleccionado: Nivel) { // Acepta el objeto Nivel completo
    // La validación de acceso ya está en el template (botón [disabled] y (click))
    // pero una comprobación aquí es una buena práctica.
    if (!nivelSeleccionado?.acceso) {
      this.presentAlert('Acceso Bloqueado', 'Completa los niveles anteriores para desbloquear este.');
      return;
    }

    console.log(`HomePage: Navegando a level-detail con ID: ${nivelSeleccionado.idnivel}`);
    // Navega a la ruta genérica '/level-detail' pasando el idnivel como parámetro
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