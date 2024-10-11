export class Subnivel {
    idsubnivel: number;
    idnivel: number;
    nombre: string;
    descripcion: string;
  
    constructor(idsubnivel: number, idnivel: number, nombre: string, descripcion: string) {
      this.idsubnivel = idsubnivel;
      this.idnivel = idnivel;
      this.nombre = nombre;
      this.descripcion = descripcion;
    }
  }
  