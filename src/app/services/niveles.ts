export class Nivel {
  idnivel: number;
  nombre: string;
  total_subniveles: number;
  dificultad: string; // Añadir esta línea
  acceso: boolean;    // Añadir esta línea

  constructor(
    idnivel: number,
    nombre: string,
    total_subniveles: number,
    dificultad: string,
    acceso: boolean
  ) {
      this.idnivel = idnivel;
      this.nombre = nombre;
      this.total_subniveles = total_subniveles;
      this.dificultad = dificultad; // Inicializar dificultad
      this.acceso = acceso; // Inicializar acceso
  }
}
