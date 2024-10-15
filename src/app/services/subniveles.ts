export class Subnivel {
  idsubnivel: number;
  idnivel: number;
  nombre: string;
  respuesta_correcta: string; // Añadido para almacenar la respuesta correcta
  imagen: string; // Añadido para almacenar la imagen

  constructor(idsubnivel: number, idnivel: number, nombre: string, respuesta_correcta: string, imagen: string) {
      this.idsubnivel = idsubnivel;
      this.idnivel = idnivel;
      this.nombre = nombre;
      this.respuesta_correcta = respuesta_correcta; // Inicializar respuesta correcta
      this.imagen = imagen; // Inicializar imagen
  }
}
