export class Subnivel {
  idsubnivel: number;
  idnivel: number;
  nombre: string;
  respuesta_correcta: string;
  imagen: string;
  completado: boolean; // Añadir completado

  constructor(idsubnivel: number, idnivel: number, nombre: string, respuesta_correcta: string, imagen: string, completado: boolean) {
    this.idsubnivel = idsubnivel;
    this.idnivel = idnivel;
    this.nombre = nombre;
    this.respuesta_correcta = respuesta_correcta;
    this.imagen = imagen;
    this.completado = completado; // Asegurarse de que se inicializa
  }
}
