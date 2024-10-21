import { Component, OnInit } from '@angular/core';
import { Usuario } from '@services/users'; // Ajusta la ruta según tu estructura de proyecto
import { UserService } from '@services/database.service'; // Ajusta la ruta según tu estructura de proyecto
import { Camera, CameraResultType } from '@capacitor/camera';
import { Logro } from '@services/logros'; // Ajusta la ruta según tu estructura de proyecto

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: Usuario | undefined;
  imagen: string | undefined; // Cambiar a string
  logros: Logro[] = []; // Inicializar como un arreglo vacío

  constructor(private userService: UserService) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.dbState().subscribe((isReady) => {
        if (isReady) {
          this.userService.getUsuarios().then(() => {
            this.userService.fetchUsuarios().subscribe((usuarios) => {
              this.user = usuarios.find(user => user.idusuario === parseInt(userId, 10));
              if (this.user && this.user.foto_perfil) {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                  this.imagen = e.target.result;
                };
                reader.readAsDataURL(this.user.foto_perfil); // Leer el Blob como Data URL
              }
            });
          });
          // Obtener logros del usuario
          this.userService.getLogrosUsuario(parseInt(userId, 10)).then((logros) => {
            this.logros = logros;
            console.log('Logros Recuperados:', JSON.stringify(logros));
          });
        }
      });
    }
  }

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });

    if (image && image.webPath) {
      this.imagen = image.webPath;

      // Convertir la imagen a Blob
      const response = await fetch(image.webPath);
      const blob = await response.blob();

      // Asegurarse de que el usuario y su idusuario existan
      if (this.user && this.user.idusuario !== undefined) {
        this.user.foto_perfil = blob;
        // Actualizar la foto de perfil en la base de datos
        await this.userService.modificarUsuario(this.user.idusuario, this.user.nombre, this.user.email, this.user.password, blob);
      } else {
        console.error('Usuario o ID de usuario no definido');
      }
    } else {
      console.error('No se pudo obtener la imagen correctamente');
    }
  }
}