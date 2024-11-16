import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/database.service'; // Asegúrate de importar el servicio de usuario

@Component({
  selector: 'app-cambionombre',
  templateUrl: './cambionombre.page.html',
  styleUrls: ['./cambionombre.page.scss'],
})
export class CambionombrePage implements OnInit {
  newName: string = ''; // Variable para almacenar el nuevo nombre

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  // Método que se ejecuta cuando se envía el formulario
  async onSubmit() {
    if (this.newName.trim() === '') {
      alert('Por favor, ingrese un nuevo nombre.');
      return;
    }

    try {
      const userId = localStorage.getItem('userId'); // Obtener el ID del usuario desde localStorage
      if (userId) {
        // Llamar al servicio para actualizar el nombre del usuario
        await this.userService.actualizarNombre(Number(userId), this.newName);
        alert('Nombre actualizado correctamente');
      } else {
        alert('Usuario no encontrado');
      }
    } catch (error) {
      console.error('Error al actualizar nombre:', error);
      alert('Hubo un error al actualizar el nombre');
    }
  }
}
