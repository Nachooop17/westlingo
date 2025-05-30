// src/app/services/auth/auth.service.ts
import { Injectable } from '@angular/core';
import {
  createClient,
  SupabaseClient,
  AuthChangeEvent,
  Session,
  User,
  AuthError
} from '@supabase/supabase-js';
import { environment } from '../../environments/environment'; // Asegúrate que la ruta es correcta
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // sendPasswordResetEmail(email: string) { // Esta línea será reemplazada por la implementación real
  //   throw new Error('Method not implemented.');
  // }
  // 
  public readonly supabase: SupabaseClient; // Hazlo público y de solo lectura

  private _currentUser = new BehaviorSubject<User | null>(null);
  private _currentSession = new BehaviorSubject<Session | null>(null);

  public currentUser$: Observable<User | null> = this._currentUser.asObservable();
  public currentSession$: Observable<Session | null> = this._currentSession.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

    this.supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      console.log('AuthService: onAuthStateChange event:', event, 'session:', session);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        this._currentUser.next(session?.user ?? null);
        this._currentSession.next(session);
      } else if (event === 'SIGNED_OUT') {
        this._currentUser.next(null);
        this._currentSession.next(null);
      }
    });
    this.loadInitialSession();
  }

  private async loadInitialSession() {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      if (error) {
        console.error('AuthService: Error loading initial session:', error.message);
        this._currentUser.next(null);
        this._currentSession.next(null);
        return;
      }
      this._currentUser.next(session?.user ?? null);
      this._currentSession.next(session);
    } catch (error) {
        console.error('AuthService: Exception loading initial session:', error);
        this._currentUser.next(null);
        this._currentSession.next(null);
    }
  }

  async signUpWithEmailPassword(
    email: string,
    password: string,
    name: string
  ): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const emailRedirectURL = 'westlingoapp://auth-callback'; // Asegúrate que este es tu esquema real

      const { data, error } = await this.supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: emailRedirectURL,
        }
      });

      if (error) {
        console.error('AuthService: Error durante signUp:', error.message);
        return { user: null, error };
      }
      console.log('AuthService: SignUp casi completo para usuario:', data.user);
      return { user: data.user, error: null };

    } catch (e: any) {
      console.error('AuthService: Excepción durante signUp:', e);
      if (e instanceof AuthError) {
        return { user: null, error: e };
      }
      const message = e?.message || 'Ocurrió un error inesperado durante el registro.';
      const status = typeof e?.status === 'number' ? e.status : 500;
      const clientError = new AuthError(message, status);
      return { user: null, error: clientError };
    }
  }

  // MÉTODO DE INICIO DE SESIÓN
  async signInWithEmailPassword(email: string, password: string): Promise<{ user: User | null; session: Session | null; error: AuthError | null }> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('AuthService: Error durante signIn:', error.message);
        return { user: null, session: null, error };
      }
      console.log('AuthService: SignIn exitoso para usuario:', data.user);
      return { user: data.user, session: data.session, error: null };

    } catch (e: any) {
      console.error('AuthService: Excepción durante signIn:', e);
      if (e instanceof AuthError) {
        return { user: null, session: null, error: e };
      }
      const message = e?.message || 'Ocurrió un error inesperado durante el inicio de sesión.';
      const status = typeof e?.status === 'number' ? e.status : 500;
      const clientError = new AuthError(message, status);
      return { user: null, session: null, error: clientError };
    }
  }

  // MÉTODO DE CIERRE DE SESIÓN
  async signOutUser(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        console.error('AuthService: Error durante signOut:', error.message);
      } else {
        console.log('AuthService: SignOut exitoso.');
        // onAuthStateChange se encargará de poner user/session a null.
      }
      return { error };
    } catch (e: any) {
      console.error('AuthService: Excepción durante signOut:', e);
      if (e instanceof AuthError) { return { error: e }; }
      const message = e?.message || 'Ocurrió un error inesperado durante el cierre de sesión.';
      const status = typeof e?.status === 'number' ? e.status : 500;
      const clientError = new AuthError(message, status);
      return { error: clientError };
    }
  }

  /**
   * Envía un correo electrónico de restablecimiento de contraseña al usuario.
   * La URL de redirección debe estar configurada en Supabase > Authentication > URL Configuration
   * y también en tu aplicación para manejar el restablecimiento.
   * @param email El correo electrónico del usuario.
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    console.log(`AuthService: Enviando correo de restablecimiento a ${email}`);
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      // IMPORTANTE: Esta URL debe ser una URL válida de tu aplicación
      // donde el usuario será redirigido para establecer la nueva contraseña.
      // Por ejemplo, 'https://tu-dominio.com/reset-password'
      // Asegúrate de que esta URL esté configurada en tu Supabase > Authentication > URL Configuration
      //redirectTo: environment.supabasePasswordResetRedirectTo || 'http://localhost:8100/login' // URL de fallback o desde env
    });

    if (error) {
      console.error('AuthService: Error al enviar correo de restablecimiento:', error);
      throw error;
    }
    console.log('AuthService: Correo de restablecimiento enviado con éxito.');
  }
}
