export class Logro {
    idlogro: number;
    idusuario: number;
    nombre: string;
    descripcion: string;
    fecha_obtencion: Date;
    imagen: Blob;
  
    constructor(
      idlogro: number,
      idusuario: number,
      nombre: string,
      descripcion: string,
      fecha_obtencion: Date,
      imagen: Blob
    ) {
      this.idlogro = idlogro;
      this.idusuario = idusuario;
      this.nombre = nombre;
      this.descripcion = descripcion;
      this.fecha_obtencion = fecha_obtencion;
      this.imagen = imagen;
    }
  }
  