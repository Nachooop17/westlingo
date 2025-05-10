import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '@services/auth.service'; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  loginData = {
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  async onLogin() {
    if (!this.loginData.email || !this.loginData.password) {
      this.showAlert('Campos Vacíos', 'Por favor, ingresa tu email y contraseña.');
      return;
    }

    try {
      const { user, session, error } = await this.authService.signInWithEmailPassword(
        this.loginData.email,
        this.loginData.password
      );

      if (error) {
        // Errores comunes de Supabase: "Invalid login credentials"
        // o "Email not confirmed" (si "Enable login for unverified users" está DESACTIVADO en Supabase)
        await this.showAlert('Error de Inicio de Sesión', error.message);
        return;
      }

      if (user && session) {
        // Las credenciales fueron correctas, Supabase devolvió un usuario y una sesión.

        // 1. VERIFICAR SI EL CORREO ESTÁ CONFIRMADO
        if (!user.email_confirmed_at) {
          await this.showAlert(
            'Correo no Confirmado',
            'Debes confirmar tu correo electrónico para poder iniciar sesión. Por favor, revisa tu bandeja de entrada.'
          );
          // Cerramos la sesión que Supabase pudo haber creado si
          // "Enable login for unverified users" está ACTIVADO en tu panel de Supabase.
          await this.authService.signOutUser();
          return;
        }

        // El correo está confirmado. Ahora verificamos el estado de baneo.
        // 2. VERIFICAR USUARIO BANEADO (como antes)
        const userMetaData = user.user_metadata;
        if (userMetaData && userMetaData['baneo'] === true) {
          await this.showAlert(
            'Acceso Denegado',
            `Tu cuenta ha sido suspendida. Razón: ${userMetaData['razon_baneo'] || 'No especificada'}`
          );
          await this.authService.signOutUser(); // Cerramos la sesión del usuario baneado
          return;
        }

        // Si el correo está confirmado y el usuario no está baneado:
        console.log('Inicio de sesión exitoso, correo confirmado, usuario no baneado. Navegando a /home');
        this.router.navigate(['/home']);

      } else if (user && !session) {
        // Este caso podría ocurrir si Supabase tiene "Enable login for unverified users" DESACTIVADO
        // Y el correo no está confirmado. En esta situación, signInWithPassword usualmente devuelve
        // un error directamente (que se captura arriba). Esta es una doble verificación.
        await this.showAlert(
          'Correo no Confirmado',
          'Debes confirmar tu correo electrónico para poder iniciar sesión. Por favor, revisa tu bandeja de entrada.'
        );
        // No hay sesión activa que cerrar explícitamente aquí si `session` es null.
        return;
      } else {
        // Fallback para casos inesperados (no debería llegar aquí si la API de Supabase funciona como se espera)
        await this.showAlert('Error', 'No se pudo iniciar sesión. Inténtalo de nuevo.');
      }
    } catch (e: any) {
      console.error('Error inesperado en onLogin:', e);
      await this.showAlert('Error Inesperado', 'Ocurrió un problema al intentar iniciar sesión.');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}