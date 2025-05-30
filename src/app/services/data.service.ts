// src/app/services/data.service.ts
import { Injectable } from '@angular/core';
import { SupabaseClient, PostgrestError } from '@supabase/supabase-js';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs'; // Importar Observable

// --- INTERFACES DE MODELO DE DATOS ---
export interface Nivel {
  idnivel: number;
  nombre: string;
  descripcion: string;
  acceso: boolean;
  total_subniveles?: number;
  dificultad?: string;
  completado?: boolean;
}

export interface Subnivel {
  id: number;
  nivel_id: number;
  numero_subnivel: number;
  nombre: string;
  contenido?: any;
  created_at?: string;
  tipo?: 'contenido' | 'quiz';
  pagina_quiz_local?: string | null;
}

export interface SubnivelConProgreso extends Subnivel {
  usuario_completado: boolean;
  usuario_puntaje?: number | null;
}

export interface ProgresoQuizzFinal {
  user_id: string;
  nivel_id: number;
  completado: boolean;
  fecha_completado: string | null;
  puntaje: number | null;
  updated_at: string;
}

// --- Interfaces auxiliares para tipar datos crudos de Supabase ---
interface NivelSupabase {
  id: number;
  numero_nivel: number;
  nombre: string;
  descripcion: string | null;
  created_at: string;
  total_subniveles: number;
  dificultad: string;
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
    if (!this.authService.supabase) {
      throw new Error("DataService: Cliente Supabase no disponible desde AuthService. Asegúrate que AuthService.supabase sea público.");
    }
    this.supabase = this.authService.supabase;
  }

  async getNivelDetails(levelId: number): Promise<Nivel | null> {
    console.log(`DataService: Buscando detalles para nivel ID ${levelId}`);
    const { data, error } = await this.supabase
      .from('niveles')
      .select<"*", NivelSupabase>('*')
      .eq('id', levelId)
      .single();

    if (error) {
      console.error(`DataService: Error obteniendo detalles del nivel ${levelId}:`, error);
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    if (!data) return null;

    return {
      idnivel: data.id,
      nombre: data.nombre,
      descripcion: data.descripcion ?? '',
      acceso: true,
      total_subniveles: data.total_subniveles,
      dificultad: data.dificultad,
    };
  }

  async getNivelesForUser(userId: string): Promise<Nivel[]> {
    console.log(`DataService: Buscando niveles para usuario ${userId}`);
    const { data: levelsData, error: levelsError } = await this.supabase
      .from('niveles')
      .select<"*", NivelSupabase>('*')
      .order('numero_nivel', { ascending: true });

    if (levelsError) { console.error('DS: Error obteniendo niveles', levelsError); throw levelsError; }
    if (!levelsData) { return []; }

    const { data: progressData, error: progressError } = await this.supabase
      .from('progreso_nivel_usuario')
      .select('nivel_id, acceso, completado')
      .eq('user_id', userId);

    if (progressError) { console.error('DS: Error obteniendo progreso de niveles', progressError); throw progressError; }

    const progressMap = new Map(progressData?.map(p => [p.nivel_id, { acceso: p.acceso, completado: p.completado }]) ?? []);

    const combinedNiveles: Nivel[] = levelsData.map(level => {
      const progress = progressMap.get(level.id);
      return {
        idnivel: level.id,
        nombre: level.nombre,
        descripcion: level.descripcion ?? '',
        acceso: progress?.acceso ?? false,
        total_subniveles: level.total_subniveles,
        dificultad: level.dificultad,
        completado: progress?.completado ?? false,
      };
    });
    console.log('DataService: Niveles combinados con progreso:', combinedNiveles);
    return combinedNiveles;
  }

  async getSubnivelesWithProgress(nivelId: number, userId: string): Promise<SubnivelConProgreso[]> {
    console.log(`[DataService] Buscando subniveles para nivel ID: ${nivelId}, usuario UID: ${userId}`);

    const { data: subnivelesData, error: subnivelesError } = await this.supabase
      .from('subniveles')
      .select<"*, tipo, pagina_quiz_local", Subnivel>('*, tipo, pagina_quiz_local')
      .eq('nivel_id', nivelId)
      .order('numero_subnivel', { ascending: true });

    console.log('[DataService] Subniveles base crudos:', JSON.stringify(subnivelesData, null, 2));
    if (subnivelesError) {
      console.error('[DataService] Error obteniendo subniveles:', subnivelesError);
      throw subnivelesError;
    }
    if (!subnivelesData || subnivelesData.length === 0) {
      console.log('[DataService] No se encontraron subniveles base para nivel_id:', nivelId);
      return [];
    }

    const subnivelIds = subnivelesData.map(s => s.id);
    console.log('[DataService] IDs de subniveles encontrados:', subnivelIds);

    const { data: progresoData, error: progresoError } = await this.supabase
      .from('progreso_subnivel_usuario')
      .select('subnivel_id, completado, puntaje')
      .eq('user_id', userId)
      .in('subnivel_id', subnivelIds);

    console.log('[DataService] Progreso de subniveles crudo:', JSON.stringify(progresoData, null, 2));
    if (progresoError) {
      console.error('[DataService] Error obteniendo progreso de subniveles:', progresoError);
      throw progresoError;
    }

    const progresoMap = new Map(progresoData?.map(p => [p.subnivel_id, { completado: p.completado, puntaje: p.puntaje }]) ?? []);
    console.log('[DataService] Mapa de progreso:', progresoMap);


    const subnivelesConProgreso: SubnivelConProgreso[] = subnivelesData.map(subnivel => {
      const progreso = progresoMap.get(subnivel.id);
      return {
        ...subnivel,
        usuario_completado: progreso?.completado ?? false,
        usuario_puntaje: progreso?.puntaje ?? null,
      };
    });

    console.log('[DataService] Subniveles finales con progreso:', JSON.stringify(subnivelesConProgreso, null, 2));
    return subnivelesConProgreso;
  }

  async updateNivelAccess(userId: string, nivelId: number, hasAccess: boolean): Promise<void> {
    console.log(`DataService: Upsert acceso para usuario ${userId}, nivel ${nivelId}, acceso ${hasAccess}`);
    const { error } = await this.supabase
      .from('progreso_nivel_usuario')
      .upsert({
          user_id: userId,
          nivel_id: nivelId,
          acceso: hasAccess
      }, {
          onConflict: 'user_id, nivel_id'
      });

    if (error) { console.error(`DS: Error en upsert de acceso para nivel ${nivelId}:`, error); throw error; }
    console.log(`DataService: Upsert de acceso exitoso para nivel ${nivelId}`);
  }

  async getSublevelByIdWithProgress(sublevelId: number, userId: string): Promise<SubnivelConProgreso | null> {
    console.log(`DataService: Buscando subnivel ID ${sublevelId} para usuario ${userId}`);

    const { data: subnivelData, error: subnivelError } = await this.supabase
      .from('subniveles')
      .select<"*, tipo, pagina_quiz_local", Subnivel>('*, tipo, pagina_quiz_local')
      .eq('id', sublevelId)
      .single();

    if (subnivelError) {
      console.error(`DS: Error obteniendo subnivel ID ${sublevelId}`, subnivelError);
      if (subnivelError.code === 'PGRST116') return null;
      throw subnivelError;
    }
    if (!subnivelData) return null;

    const { data: progresoData, error: progresoError } = await this.supabase
      .from('progreso_subnivel_usuario')
      .select('completado, puntaje')
      .eq('user_id', userId)
      .eq('subnivel_id', sublevelId)
      .single();

    if (progresoError && progresoError.code !== 'PGRST116') {
      console.error(`DS: Error obteniendo progreso para subnivel ID ${sublevelId}`, progresoError);
      throw progresoError;
    }

    const sublevelConProgreso: SubnivelConProgreso = {
      ...subnivelData,
      usuario_completado: progresoData?.completado ?? false,
      usuario_puntaje: progresoData?.puntaje ?? null,
    };

    console.log('DataService: Subnivel con progreso:', sublevelConProgreso);
    return sublevelConProgreso;
  }

  async updateProgresoSubnivel(userId: string, sublevelId: number, completado: boolean, puntaje: number | null = null): Promise<void> {
    console.log(`DataService: Upsert progreso subnivel para user ${userId}, subnivel ${sublevelId}`);
    const { error } = await this.supabase
      .from('progreso_subnivel_usuario')
      .upsert({
        user_id: userId,
        subnivel_id: sublevelId,
        completado: completado,
        puntaje: puntaje,
        fecha_completado: completado ? new Date().toISOString() : null
      }, {
        onConflict: 'user_id, subnivel_id'
      });

    if (error) { console.error(`DS: Error upsert progreso subnivel ${sublevelId}:`, error); throw error; }
    console.log(`DataService: Upsert progreso subnivel ${sublevelId} exitoso`);
  }

  async getProgresoQuizzFinal(nivelId: number, userId: string): Promise<ProgresoQuizzFinal | null> {
    try {
      const { data, error } = await this.supabase
        .from('progreso_quiz_final_usuario')
        .select('*')
        .eq('user_id', userId)
        .eq('nivel_id', nivelId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('DataService: Error al obtener progreso del quizz final:', error);
        throw error;
      }
      return data || null;
    } catch (error) {
      console.error('DataService: Excepción en getProgresoQuizzFinal:', error);
      throw error;
    }
  }

  async updateProgresoQuizzFinal(userId: string, nivelId: number, completado: boolean, puntaje: number | null): Promise<void> {
    try {
      const { data, error } = await this.supabase
        .from('progreso_quiz_final_usuario')
        .upsert(
          {
            user_id: userId,
            nivel_id: nivelId,
            completado: completado,
            puntaje: puntaje,
            fecha_completado: completado ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'user_id,nivel_id' }
        );

      if (error) {
        console.error('DataService: Error al actualizar progreso del quizz final:', error);
        throw error;
      }
      console.log('DataService: Progreso del quizz final actualizado/insertado:', data);
    } catch (error) {
      console.error('DataService: Excepción en updateProgresoQuizzFinal:', error);
      throw error;
    }
  }

  /**
   * Suscribe a los cambios en tiempo real del progreso de niveles de un usuario.
   * @param userId El ID del usuario.
   * @returns Un Observable que emite cuando hay cambios en la tabla 'progreso_nivel_usuario' para ese usuario.
   */
  subscribeToUserLevelProgress(userId: string): Observable<any> {
    return new Observable(observer => {
      const subscription = this.supabase
        .channel(`user_level_progress_${userId}`) // Nombre único del canal
        .on<any>(
          'postgres_changes',
          {
            event: '*', // Escucha todos los eventos (INSERT, UPDATE, DELETE)
            schema: 'public',
            table: 'progreso_nivel_usuario',
            filter: `user_id=eq.${userId}` // Filtra por el ID del usuario
          },
          payload => {
            console.log('Supabase Realtime: Cambio detectado en progreso_nivel_usuario:', payload);
            observer.next(payload); // Emite el payload del cambio
          }
        )
        .subscribe((status) => {
          console.log(`Supabase Realtime Channel Status for user ${userId}:`, status);
          if (status === 'SUBSCRIBED') {
            // Opcional: Puedes emitir un valor inicial o solo esperar cambios
          }
        });

      // Función de limpieza cuando el observable se desuscribe
      return () => {
        console.log(`Supabase Realtime: Desuscribiendo del canal para user ${userId}`);
        this.supabase.removeChannel(subscription);
      };
    });
  }
}
