import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/database.service'; // Asegúrate de que la ruta sea correcta
import { Nivel } from '@services/niveles'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  niveles: Nivel[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    // Aquí llamas a fetchNiveles() para obtener los niveles
    this.userService.fetchNiveles().subscribe(niveles => {
      this.niveles = niveles;
      console.log('Niveles obtenidos:', this.niveles); // Para depuración
    });
  }
}
