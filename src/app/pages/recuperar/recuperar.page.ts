// src/app/pages/recuperar/recuperar.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngIf
import { FormsModule } from '@angular/forms'; // Para ngModel
import { Router, RouterModule } from '@angular/router'; // Para navegación y routerLink
import { 
  IonicModule, // Para componentes Ionic
  AlertController, 
  LoadingController, 
  NavController 
} from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service'; // Asegúrate de que la ruta a tu AuthService sea correcta

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
  standalone: true, // Componente autónomo
  imports: [
    CommonModule, // Necesario para directivas como *ngIf
    FormsModule, // Necesario para ngModel
    RouterModule, // Necesario para routerLink
    IonicModule // Importa todos los componentes Ionic
  ]
})
export class RecuperarPage implements OnInit {
  email: string = '';
  isLoading: boolean = false;
  message: string | null = null;
  isError: boolean = false;

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router,
    private navCtrl: NavController // Para el botón de retroceso
  ) { }

  ngOnInit() {
  }

  /**
   * Envía un correo electrónico de restablecimiento de contraseña.
   */
  async resetPassword() {
    if (!this.email) {
      this.presentAlert('Error', 'Por favor, introduce tu correo electrónico.');
      return;
    }

    this.isLoading = true;
    this.message = null;
    this.isError = false;
    const loading = await this.loadingController.create({
      message: 'Enviando enlace de restablecimiento...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      // Llama al método de tu AuthService para enviar el correo de restablecimiento
      // Asumiendo que tu AuthService tiene un método como 'sendPasswordResetEmail'
      await this.authService.sendPasswordResetEmail(this.email);
      
      this.message = 'Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico. Por favor, revisa tu bandeja de entrada (y spam).';
      this.isError = false;
      this.email = ''; // Limpiar el campo de correo
      
      // Opcional: Redirigir al usuario después de un breve momento
      setTimeout(() => {
        this.navCtrl.back(); // O this.router.navigate(['/login']);
      }, 3000);

    } catch (error: any) {
      console.error('Error al restablecer contraseña:', error);
      this.message = `Error al enviar el enlace: ${error.message || 'Ocurrió un error inesperado.'}`;
      this.isError = true;
    } finally {
      this.isLoading = false;
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

  goBack() {
    this.navCtrl.back(); // Vuelve a la página anterior (ej. login)
  }
}
