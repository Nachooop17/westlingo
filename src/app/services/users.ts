export class Usuario {
  idusuario: number;
  nombre: string;
  email: string;
  password: string;
  foto_perfil: Blob;
  baneo: boolean;
  razon: string | null;

  constructor(idusuario: number, nombre: string, email: string, password: string, foto_perfil: Blob, baneo: boolean = false, razon: string | null = null) {
    this.idusuario = idusuario;
    this.nombre = nombre;
    this.email = email;
    this.password = password;
    this.foto_perfil = foto_perfil;
    this.baneo = baneo;
    this.razon = razon;
  }
}
