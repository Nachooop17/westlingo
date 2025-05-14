// src/app/services/niveles.ts

// 1. Interfaz Nivel (RECOMENDADO)
// Cambiado de clase a interfaz y 'acceso' a boolean.
// Añadida 'descripcion' porque la usamos.
export interface Nivel {
  idnivel: number;
  nombre: string;
  descripcion: string;         // La necesitas para LevelDetailPage y DataService
  acceso: boolean;             // CAMBIADO a boolean para consistencia
  total_subniveles?: number;  // Hacer opcional si no siempre viene o no es crucial
  dificultad?: string;        // Hacer opcional
  completado?: boolean;       // Opcional: si necesitas rastrear si el nivel entero está completo
}

// 2. Interfaz Subnivel (NUEVA)
// Define la estructura base de un subnivel como viene de tu tabla 'subniveles'.
export interface Subnivel {
  id: number;                 // PK de la tabla subniveles
  nivel_id: number;           // FK a la tabla niveles
  numero_subnivel: number;    // Orden dentro del nivel
  nombre: string;
  contenido?: any;            // jsonb o text. Puedes definir una interfaz más específica para 'contenido' si quieres.
  created_at?: string;        // Si lo seleccionas desde la BD
  // ...cualquier otra propiedad que tenga tu tabla 'subniveles'
}

// 3. Interfaz SubnivelConProgreso (NUEVA)
// Combina la información de un Subnivel con el progreso específico del usuario.
export interface SubnivelConProgreso extends Subnivel { // Hereda todas las propiedades de Subnivel
  usuario_completado: boolean;    // Si el usuario actual completó este subnivel
  usuario_puntaje?: number | null; // Puntaje del usuario actual en este subnivel
}

/*
// --- TU CLASE Nivel ORIGINAL MODIFICADA (Alternativa si DEBES usar una clase) ---
// Si decides mantener Nivel como una clase, así debería lucir con 'acceso' como boolean:
// Y tu DataService tendría que instanciarla con 'new Nivel(...)'
export class NivelClase {
  idnivel: number;
  nombre: string;
  descripcion: string; // Importante añadirla si la usas
  total_subniveles: number;
  dificultad: string;
  acceso: boolean; // CAMBIADO a boolean

  constructor(
    idnivel: number,
    nombre: string,
    descripcion: string,
    total_subniveles: number,
    dificultad: string,
    acceso: boolean // CAMBIADO a boolean
  ) {
    this.idnivel = idnivel;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.total_subniveles = total_subniveles;
    this.dificultad = dificultad;
    this.acceso = acceso;
  }
}
*/