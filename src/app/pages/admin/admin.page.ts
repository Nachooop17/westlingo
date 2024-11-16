import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/database.service';
import { Usuario } from '@services/users';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  usuarios: Usuario[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  async cargarUsuarios() {
    try {
      this.usuarios = await this.userService.obtenerUsuarios();
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  }
}
