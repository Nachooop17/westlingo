// src/app/pages/profile/profile.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngIf y *ngFor
import { Router, RouterModule } from '@angular/router'; // Para navegación y routerLink
import { 
  IonicModule, // Para componentes Ionic
  AlertController, 
  LoadingController, 
  NavController 
} from '@ionic/angular';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service'; // Asegúrate de la ruta correcta
import { DataService, Nivel } from 'src/app/services/data.service'; // Asegúrate de la ruta correcta
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true, // Componente autónomo
  imports: [
    CommonModule, // Necesario para directivas como *ngIf, *ngFor
    RouterModule, // Necesario para routerLink
    IonicModule // Importa todos los componentes Ionic
  ]
})
export class ProfilePage implements OnInit, OnDestroy {
  currentUser: User | null = null;
  userName: string = 'Cargando...';
  userEmail: string = 'Cargando...';
  completedLevels: Nivel[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  private userSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.userName = user.user_metadata?.['full_name'] || user.email || 'Usuario';
        this.userEmail = user.email || 'N/A';
        this.loadUserData(user.id);
      } else {
        console.log('ProfilePage: No hay usuario autenticado, redirigiendo a login...');
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  async loadUserData(userId: string) {
    this.isLoading = true;
    this.errorMessage = null;
    try {
      const niveles = await this.dataService.getNivelesForUser(userId);
      this.completedLevels = niveles.filter(nivel => nivel.completado);
      console.log('ProfilePage: Niveles completados cargados:', this.completedLevels);
    } catch (error: any) {
      console.error('ProfilePage: Error al cargar datos del usuario o niveles:', error);
      this.errorMessage = `Error al cargar tu perfil: ${error.message || 'Error desconocido'}`;
    } finally {
      this.isLoading = false;
    }
  }

  async signOut() {
    const loading = await this.loadingController.create({
      message: 'Cerrando sesión...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      const { error } = await this.authService.signOutUser(); // Usar signOutUser
      if (error) {
        throw error;
      }
      console.log('ProfilePage: Sesión cerrada con éxito.');
      this.router.navigate(['/login'], { replaceUrl: true }); // Redirigir al login y limpiar historial
    } catch (error: any) {
      console.error('ProfilePage: Error al cerrar sesión:', error);
      this.presentAlert('Error al cerrar sesión', error.message || 'Ocurrió un error inesperado.');
    } finally {
      loading.dismiss();
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
}
