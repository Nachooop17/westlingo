export class Nivel {
  idnivel: number;
  nombre: string;
  total_subniveles: number;
  dificultad: string; // Añadir esta línea
  acceso: string;    // Añadir esta línea

  constructor(
    idnivel: number,
    nombre: string,
    total_subniveles: number,
    dificultad: string,
    acceso: string
  ) {
      this.idnivel = idnivel;
      this.nombre = nombre;
      this.total_subniveles = total_subniveles;
      this.dificultad = dificultad; // Inicializar dificultad
      this.acceso = acceso; // Inicializar acceso
  }
}
