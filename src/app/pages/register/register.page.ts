import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
// Importa el NUEVO AuthService
import { AuthService } from '@services/auth.service'; // Ajusta la ruta si es necesario
import { Router } from '@angular/router';
// Ya no necesitas importar UserService (el antiguo) ni Usuario aquí para el registro

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false // Esto es correcto si no es un componente standalone
})
export class RegisterPage {
  name!: string;
  email!: string;
  password!: string;
  r_password!: string;

  constructor(
    private alertController: AlertController,
    private authService: AuthService, // Inyecta el nuevo AuthService
    private router: Router
  ) {}

  async onRegister() { // Ya no necesitas 'form: { valid: any; }' a menos que uses ngForm
    // 1. Validaciones del lado del cliente (puedes mantener las que tenías)
    if (this.password !== this.r_password) {
      this.showAlert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (!this.name || !this.email || !this.password /* || !this.r_password ya validado arriba */) {
      this.showAlert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.showAlert('Error', 'El formato del email no es válido');
      return;
    }

    // Tu validación de contraseña:
    // Supabase por defecto requiere mínimo 6 caracteres. Puedes ajustar esto en tu panel de Supabase.
    // Tu regex: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,10}$/
    // Considera si quieres mantener esta regex estricta o confiar más en los errores de Supabase.
    // Por ahora, la mantenemos:
    if (!this.isValidPassword(this.password)) {
      this.showAlert(
        'Error de Contraseña',
        'La contraseña debe tener entre 4 y 10 caracteres, incluir una letra mayúscula, un número y un símbolo.'
      );
      return;
    }

    // 2. Llamar al método signUp del AuthService
    try {
      const { user, error } = await this.authService.signUpWithEmailPassword(
        this.email,
        this.password,
        this.name
      );

      if (error) {
        // Mostrar el mensaje de error de Supabase (suele ser descriptivo)
        await this.showAlert('Error de Registro', error.message);
      } else if (user) {
        // El registro fue exitoso en Supabase
        // Por defecto, Supabase tiene la confirmación por email ACTIVADA.
        // Si está activada, user.email_confirmed_at será null o la fecha de confirmación.
        // Y la sesión (obtenida por onAuthStateChange) será null hasta que se confirme.

        const isEmailConfirmationRequired = !user.email_confirmed_at; // Un buen indicador

        if (isEmailConfirmationRequired) {
          // El usuario necesita confirmar su email
          await this.showAlert(
            '¡Registro Casi Completo!',
            'Te has registrado correctamente. Por favor, revisa tu bandeja de entrada para confirmar tu dirección de correo electrónico.'
          );
          // Redirigir a la página de login o a una página informativa
          this.router.navigate(['/login']); // O una ruta como '/check-email'
        } else {
          // La confirmación por email está DESACTIVADA en Supabase, o ya está confirmado.
          // El usuario debería estar logueado y la sesión activa (manejado por onAuthStateChange)
          await this.showAlert(
            '¡Registro Exitoso!',
            'Tu cuenta ha sido creada y ya puedes acceder.'
          );
          this.router.navigate(['/home']); // Redirige a la página principal
        }
      } else {
        // Caso poco común donde no hay ni usuario ni error, pero por si acaso.
         await this.showAlert('Error de Registro', 'No se pudo completar el registro. Intenta de nuevo.');
      }
    } catch (e: any) {
      // Este catch es para errores inesperados no controlados por el try/catch interno del servicio.
      console.error('Error inesperado en onRegister:', e);
      await this.showAlert('Error Inesperado', 'Ocurrió un problema durante el registro. Por favor, intenta más tarde.');
    }
  }

  // Tus funciones de validación y alerta pueden permanecer igual
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  isValidPassword(password: string): boolean {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,10}$/;
    return passwordPattern.test(password);
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