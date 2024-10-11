import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/database.service';
import { Usuario } from '@services/users';



@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.page.html',
  styleUrls: ['./user-management.page.scss'],
})
export class UserManagementPage implements OnInit {
  usuarios: Usuario[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.userService.fetchUsuarios().subscribe((data: Usuario[]) => {
      this.usuarios = data;
    });
  }

  eliminarUsuario(id: number) {
    this.userService.eliminarUsuario(id);
  }
}
