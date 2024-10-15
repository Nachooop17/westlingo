import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/database.service';
import { Usuario } from '@services/users';
import { Nivel } from '@services/niveles'; // Asegúrate de importar tu modelo de niveles

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.page.html',
  styleUrls: ['./user-management.page.scss'],
})
export class UserManagementPage implements OnInit {
  usuarios: Usuario[] = [];
  niveles: Nivel[] = []; // Variable para niveles

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsuarios();
    this.loadNiveles(); // Cargar niveles al iniciar
  }

  loadUsuarios() {
    this.userService.fetchUsuarios().subscribe((data: Usuario[]) => {
      this.usuarios = data;
    });
  }

  loadNiveles() {
    this.userService.getNiveles().then(niveles => {
      this.niveles = niveles; // Almacena los niveles en una propiedad del componente
    });
  }

  eliminarUsuario(id: number) {
    this.userService.eliminarUsuario(id);
  }
}
