import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, AlertController, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataService, Nivel } from 'src/app/services/data.service';
import { User } from '@supabase/supabase-js';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonicModule
  ]
})
export class ProfilePage implements OnInit, OnDestroy {
  currentUser: User | null = null;
  userName: string = 'Cargando...';
  userEmail: string = 'Cargando...';
  avatarUrl: string | null = null;
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
    this.userSubscription = this.authService.currentUser$.subscribe(async user => {
      if (user) {
        this.currentUser = user;
        this.userName = user.user_metadata?.['full_name'] || user.email || 'Usuario';
        this.userEmail = user.email || 'N/A';
        await this.loadUserData(user.id);
        await this.loadProfileAvatar(user.id);
      } else {
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
    } catch (error: any) {
      this.errorMessage = `Error al cargar tu perfil: ${error.message || 'Error desconocido'}`;
    } finally {
      this.isLoading = false;
    }
  }

  async loadProfileAvatar(userId: string) {
    // Supabase client desde AuthService
    const supabase = this.authService.supabase;
    const { data, error } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', userId)
      .single();
    if (data && data.avatar_url) {
      this.avatarUrl = data.avatar_url;
    } else {
      this.avatarUrl = null;
    }
  }

  // Utilidad para convertir base64 a Blob
  base64toBlob(base64Data: string, contentType: string) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  async changeProfilePhoto() {
    if (!this.currentUser) return;
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    });

    if (!image.base64String) return;

    const supabase = this.authService.supabase;
    const fileName = `${this.currentUser.id}_${Date.now()}.jpeg`; // No slash at start!

    // Convierte base64 a Blob antes de subir
    const imageBlob = this.base64toBlob(image.base64String, 'image/jpeg');

    const { data, error } = await supabase
      .storage
      .from('avatars')
      .upload(fileName, imageBlob, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error('Supabase upload error:', error);
      this.presentAlert('Error', `No se pudo subir la imagen: ${error.message || JSON.stringify(error)}`);
      return;
    }

    const { publicUrl } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(fileName).data;

    await supabase
      .from('profiles')
      .upsert({ id: this.currentUser.id, avatar_url: publicUrl });

    this.avatarUrl = publicUrl;
    this.presentAlert('¡Listo!', 'Tu foto de perfil ha sido actualizada.');
  }

  async signOut() {
    const loading = await this.loadingController.create({
      message: 'Cerrando sesión...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      const { error } = await this.authService.signOutUser();
      if (error) {
        throw error;
      }
      this.router.navigate(['/login'], { replaceUrl: true });
    } catch (error: any) {
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