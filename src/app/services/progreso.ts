export class Progreso {
    idprogreso: number;
    idusuario: number;
    idnivel: number;
    idsubnivel: number;
    progreso: number;
    completado: boolean;
  
    constructor(
      idprogreso: number,
      idusuario: number,
      idnivel: number,
      idsubnivel: number,
      progreso: number,
      completado: boolean
    ) {
      this.idprogreso = idprogreso;
      this.idusuario = idusuario;
      this.idnivel = idnivel;
      this.idsubnivel = idsubnivel;
      this.progreso = progreso;
      this.completado = completado;
    }
  }
  