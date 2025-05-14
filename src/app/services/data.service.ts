// src/app/services/data.service.ts
import { Injectable } from '@angular/core';
import { SupabaseClient, PostgrestError } from '@supabase/supabase-js';
import { AuthService } from './auth.service'; // Asegúrate que la ruta es correcta

// --- INTERFACES DE MODELO DE DATOS ---
// Estas interfaces definen la forma de los datos que tu aplicación espera.

// Interfaz para los datos que tu aplicación usará para un Nivel
export interface Nivel {
  idnivel: number;
  nombre: string;
  descripcion: string;
  acceso: boolean;             // Si el usuario actual tiene acceso
  total_subniveles?: number;  // Total de subniveles en este nivel
  dificultad?: string;
  completado?: boolean;       // Si el usuario actual completó este nivel
}

// Interfaz para la estructura base de un Subnivel (de tu tabla 'subniveles')
export interface Subnivel {
  id: number;                 // PK de la tabla subniveles
  nivel_id: number;           // FK a la tabla niveles
  numero_subnivel: number;    // Orden dentro del nivel
  nombre: string;
  contenido?: any;            // jsonb o text. Define una estructura más específica si puedes.
  created_at?: string;        // Si lo seleccionas desde la BD
}

// Interfaz que combina Subnivel con el progreso específico del usuario.
export interface SubnivelConProgreso extends Subnivel {
  usuario_completado: boolean;    // Si el usuario actual completó este subnivel
  usuario_puntaje?: number | null; // Puntaje del usuario actual en este subnivel
}

// --- Interfaces auxiliares para tipar datos crudos de Supabase ---
// (Estas son internas al servicio y no necesitan ser exportadas si solo se usan aquí)
interface NivelSupabase { // Coincide con columnas de tu tabla 'niveles'
  id: number;
  numero_nivel: number;
  nombre: string;
  descripcion: string | null;
  created_at: string;
  total_subniveles: number;
  dificultad: string;
}

interface ProgresoNivelSupabase { // Coincide con columnas de 'progreso_nivel_usuario'
  user_id: string;
  nivel_id: number;
  acceso: boolean;
  completado: boolean;
  updated_at: string;
}

// ProgresoSubnivelUsuario (para la tabla 'progreso_subnivel_usuario')
// Puedes definir una interfaz si lo deseas, o manejarlo directamente en el método.


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

  /**
   * Obtiene los detalles de un nivel específico.
   */
  async getNivelDetails(levelId: number): Promise<Nivel | null> {
    console.log(`DataService: Buscando detalles para nivel ID ${levelId}`);
    const { data, error } = await this.supabase
      .from('niveles')
      .select<"*", NivelSupabase>('*') // Usar la interfaz NivelSupabase
      .eq('id', levelId)
      .single();

    if (error) {
      console.error(`DataService: Error obteniendo detalles del nivel ${levelId}:`, error);
      if (error.code === 'PGRST116') { // PGRST116: "Fetched result consists of 0 rows"
        return null; // El nivel no fue encontrado
      }
      throw error;
    }
    if (!data) return null;

    // Mapea los datos de Supabase a tu interfaz Nivel de la aplicación
    // 'acceso' y 'completado' para el nivel general son específicos del usuario.
    // Para una página de detalle, si el usuario llegó, asumimos acceso.
    // El estado 'completado' del nivel podría buscarse aquí si es necesario.
    return {
      idnivel: data.id,
      nombre: data.nombre,
      descripcion: data.descripcion ?? '',
      acceso: true, // Si el usuario puede ver esta página, implícitamente tiene acceso.
      total_subniveles: data.total_subniveles,
      dificultad: data.dificultad,
      // completado: false, // Requeriría una consulta a progreso_nivel_usuario para este nivel y usuario
    };
  }

  /**
   * Obtiene todos los niveles ordenados y el estado de acceso/completado para el usuario.
   */
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
        completado: progress?.completado ?? false, // Añadido por consistencia
      };
    });
    console.log('DataService: Niveles combinados con progreso:', combinedNiveles);
    return combinedNiveles;
  }

  /**
   * Obtiene los subniveles de un nivel, junto con el progreso del usuario en ellos.
   */
  async getSubnivelesWithProgress(nivelId: number, userId: string): Promise<SubnivelConProgreso[]> {
    console.log(`[DataService] Buscando subniveles para nivel ID: ${nivelId}, usuario UID: ${userId}`);

    // 1. Obtener todos los subniveles del nivel, ordenados
    const { data: subnivelesData, error: subnivelesError } = await this.supabase
      .from('subniveles')
      .select<"*", Subnivel>('*') // Tu interfaz Subnivel
      .eq('nivel_id', nivelId)
      .order('numero_subnivel', { ascending: true });

    // LOG #1: ¿Se obtuvieron los subniveles base?
    console.log('[DataService] Subniveles base crudos:', JSON.stringify(subnivelesData, null, 2));
    if (subnivelesError) {
      console.error('[DataService] Error obteniendo subniveles:', subnivelesError);
      throw subnivelesError;
    }
    if (!subnivelesData || subnivelesData.length === 0) {
      console.log('[DataService] No se encontraron subniveles base para nivel_id:', nivelId);
      return []; // Importante devolver array vacío si no hay subniveles
    }

    // 2. Obtener el progreso del usuario para estos subniveles
    const subnivelIds = subnivelesData.map(s => s.id);
    console.log('[DataService] IDs de subniveles encontrados:', subnivelIds); // LOG #2

    const { data: progresoData, error: progresoError } = await this.supabase
      .from('progreso_subnivel_usuario')
      .select('subnivel_id, completado, puntaje')
      .eq('user_id', userId)
      .in('subnivel_id', subnivelIds);

    // LOG #3: ¿Se obtuvo el progreso?
    console.log('[DataService] Progreso de subniveles crudo:', JSON.stringify(progresoData, null, 2));
    if (progresoError) {
      console.error('[DataService] Error obteniendo progreso de subniveles:', progresoError);
      throw progresoError; // O maneja el error de forma diferente si prefieres
    }

    // 3. Combinar datos
    const progresoMap = new Map(progresoData?.map(p => [p.subnivel_id, { completado: p.completado, puntaje: p.puntaje }]) ?? []);
    // LOG #4: ¿Cómo se ve el mapa de progreso?
    console.log('[DataService] Mapa de progreso:', progresoMap);


    const subnivelesConProgreso: SubnivelConProgreso[] = subnivelesData.map(subnivel => {
      const progreso = progresoMap.get(subnivel.id);
      return {
        ...subnivel,
        usuario_completado: progreso?.completado ?? false,
        usuario_puntaje: progreso?.puntaje ?? null,
      };
    });

    // LOG #5: ¿Resultado final?
    console.log('[DataService] Subniveles finales con progreso:', JSON.stringify(subnivelesConProgreso, null, 2));
    return subnivelesConProgreso;
  }

  /**
   * Actualiza o inserta (Upsert) el estado de acceso para un nivel y usuario.
   */
  async updateNivelAccess(userId: string, nivelId: number, hasAccess: boolean): Promise<void> {
    console.log(`DataService: Upsert acceso para usuario ${userId}, nivel ${nivelId}, acceso ${hasAccess}`);
    const { error } = await this.supabase
      .from('progreso_nivel_usuario')
      .upsert({
          user_id: userId,
          nivel_id: nivelId,
          acceso: hasAccess
          // Considera si también quieres actualizar 'completado' o 'updated_at' aquí
      }, {
          onConflict: 'user_id, nivel_id'
      });

    if (error) { console.error(`DS: Error en upsert de acceso para nivel ${nivelId}:`, error); throw error; }
    console.log(`DataService: Upsert de acceso exitoso para nivel ${nivelId}`);
  }
   async getSublevelByIdWithProgress(sublevelId: number, userId: string): Promise<SubnivelConProgreso | null> {
    console.log(`DataService: Buscando subnivel ID ${sublevelId} para usuario ${userId}`);

    // 1. Obtener el subnivel base
    const { data: subnivelData, error: subnivelError } = await this.supabase
      .from('subniveles')
      .select<"*", Subnivel>('*') // Tu interfaz Subnivel
      .eq('id', sublevelId)
      .single(); // Esperamos un solo resultado

    if (subnivelError) {
      console.error(`DS: Error obteniendo subnivel ID ${sublevelId}`, subnivelError);
      if (subnivelError.code === 'PGRST116') return null; // No encontrado
      throw subnivelError;
    }
    if (!subnivelData) return null;

    // 2. Obtener el progreso del usuario para este subnivel
    const { data: progresoData, error: progresoError } = await this.supabase
      .from('progreso_subnivel_usuario')
      .select('completado, puntaje')
      .eq('user_id', userId)
      .eq('subnivel_id', sublevelId)
      .single(); // Esperamos un solo registro de progreso o ninguno

    if (progresoError && progresoError.code !== 'PGRST116') { // Ignora error si no hay progreso (PGRST116)
      console.error(`DS: Error obteniendo progreso para subnivel ID ${sublevelId}`, progresoError);
      throw progresoError;
    }

    // 3. Combinar datos
    const sublevelConProgreso: SubnivelConProgreso = {
      ...subnivelData,
      usuario_completado: progresoData?.completado ?? false,
      usuario_puntaje: progresoData?.puntaje ?? null,
    };

    console.log('DataService: Subnivel con progreso:', sublevelConProgreso);
    return sublevelConProgreso;
  }

  /**
   * Actualiza o inserta (Upsert) el progreso de un subnivel para un usuario.
   */
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
}