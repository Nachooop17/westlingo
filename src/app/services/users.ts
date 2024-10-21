export class Usuario {
  idusuario: number;
  nombre: string;
  email: string;
  password: string;
  foto_perfil: Blob;

  constructor(idusuario: number, nombre: string, email: string, password: string, foto_perfil: Blob) {
    this.idusuario = idusuario;
    this.nombre = nombre;
    this.email = email;
    this.password = password;
    this.foto_perfil = foto_perfil;
  }
}
