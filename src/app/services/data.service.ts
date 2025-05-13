// src/app/services/data.service.ts
import { Injectable } from '@angular/core';
import { SupabaseClient, PostgrestError } from '@supabase/supabase-js';
import { Nivel } from '@services/niveles'; // Asegúrate que la ruta e interfaz son correctas
import { AuthService } from './auth.service';

// Interfaces opcionales para tipar los datos de Supabase (ayuda a evitar errores)
// Asegúrate que los nombres de propiedades coincidan con tus columnas en Supabase
// Dentro de data.service.ts
interface NivelSupabase {
  id: number;
  numero_nivel: number;
  nombre: string;
  descripcion: string | null;
  created_at: string;
  total_subniveles: number; // <-- Añadir
  dificultad: string;      // <-- Añadir (ajusta el tipo si es diferente)
}

interface ProgresoNivelSupabase {
  user_id: string;
  nivel_id: number;
  acceso: boolean;
  completado: boolean;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private supabase: SupabaseClient;

  constructor(private authService: AuthService) {
    // Accede al cliente Supabase público desde AuthService
    if (!this.authService.supabase) {
       throw new Error("DataService: Cliente Supabase no disponible desde AuthService.");
    }
    this.supabase = this.authService.supabase;
  }

  /**
   * Obtiene todos los niveles ordenados por numero_nivel y
   * añade el estado de acceso y completado para el usuario especificado.
   */
  async getNivelesForUser(userId: string): Promise<Nivel[]> {
    // ... (fetch levelsData y progressData como antes) ...
    // Asegúrate que el select('*') en niveles obtiene todas las columnas que necesitas

    const { data: levelsData, error: levelsError } = await this.supabase
      .from('niveles')
      .select<"*", NivelSupabase>('*') // Selecciona todo de niveles
      .order('numero_nivel', { ascending: true });
    // ... (manejo de error) ...

    const { data: progressData, error: progressError } = await this.supabase
      .from('progreso_nivel_usuario')
      .select('nivel_id, acceso, completado')
      .eq('user_id', userId);
    // ... (manejo de error) ...

   // Dentro de DataService.getNivelesForUser

// ... (obtener levelsData y progressData, verificar errores) ...

      const progressMap = new Map(progressData?.map(p => [p.nivel_id, { acceso: p.acceso, completado: p.completado }]) ?? []);

      // ---- LÍNEA CORREGIDA ----
      const combinedNiveles: Nivel[] = levelsData?.map(level => { // Añade '?.' después de levelsData
          const progress = progressMap.get(level.id);
          // ... (el objeto que retornas sigue igual)
          return {
              idnivel: level.id,
              nombre: level.nombre,
              descripcion: level.descripcion ?? '',
              acceso: progress?.acceso ?? false,
              total_subniveles: level.total_subniveles,
              dificultad: level.dificultad,
          };
      }) ?? []; // Añade '?? []' al final para devolver [] si levelsData era null/undefined
      // -------------------------

      console.log('DataService: Combined levels with access:', combinedNiveles);
      return combinedNiveles;
}

  /**
   * Actualiza o inserta (Upsert) el estado de acceso para un nivel y usuario.
   * Nota: Los triggers ya manejan el acceso inicial (nivel 1) y los desbloqueos posteriores.
   * Esta función puede servir como respaldo o para forzar un estado si es necesario.
   */
  async updateNivelAccess(userId: string, nivelId: number, hasAccess: boolean): Promise<void> {
    console.log(`DataService: Upsert acceso para usuario ${userId}, nivel ${nivelId}, acceso ${hasAccess}`);
    const { error } = await this.supabase
      .from('progreso_nivel_usuario') // Nombre de tabla correcto
      .upsert({
          user_id: userId,        // Nombre de columna correcto (uuid)
          nivel_id: nivelId,      // Nombre de columna correcto (bigint/int)
          acceso: hasAccess
          // No establecemos 'completado' aquí, solo 'acceso'
      }, {
          onConflict: 'user_id, nivel_id' // Columnas de la PK compuesta correcta
      });

    if (error) {
      console.error(`DataService: Error en upsert de acceso para nivel ${nivelId}:`, error);
      throw error;
    }
     console.log(`DataService: Upsert de acceso exitoso para nivel ${nivelId}`);
  }

  // --- Puedes añadir aquí más métodos para interactuar con Supabase ---
  // Por ejemplo, para actualizar el progreso de un subnivel:
  async updateProgresoSubnivel(userId: string, sublevelId: number, completado: boolean, puntaje: number | null = null): Promise<void> {
    console.log(`DataService: Upsert progreso subnivel para user ${userId}, subnivel ${sublevelId}`);
    const { error } = await this.supabase
      .from('progreso_subnivel_usuario') // Nombre de tabla correcto
      .upsert({
        user_id: userId,          // Nombre de columna correcto
        subnivel_id: sublevelId,  // Nombre de columna correcto
        completado: completado,
        puntaje: puntaje,
        fecha_completado: completado ? new Date().toISOString() : null // Actualiza fecha solo si se completa
      }, {
        onConflict: 'user_id, subnivel_id' // PK compuesta correcta
      });

    if (error) {
       console.error(`DataService: Error upsert progreso subnivel ${sublevelId}:`, error);
       throw error;
    }
    console.log(`DataService: Upsert progreso subnivel ${sublevelId} exitoso`);
    // Recuerda: El trigger 'on_sublevel_complete' se disparará automáticamente
    // en la base de datos si 'completado' se puso a true aquí.
  }

}

// Interfaz Nivel (ejemplo, asegúrate que coincida con tu archivo real @services/niveles)
// export interface Nivel {
//   idnivel: number;
//   nombre: string;
//   descripcion: string;
//   acceso: boolean;
//   // completado?: boolean; // Opcional
// }