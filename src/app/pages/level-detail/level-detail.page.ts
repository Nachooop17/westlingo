// src/app/pages/level-detail/level-detail.page.ts
import { Component, OnInit } from '@angular/core'; // Ya no necesitas CommonModule, IonicModule, etc. aquí
import { ActivatedRoute } from '@angular/router';
// ... otras importaciones que tu COMPONENTE usa (DataService, AuthService, etc.)

@Component({
  selector: 'app-level-detail',
  templateUrl: './level-detail.page.html',
  styleUrls: ['./level-detail.page.scss'],
  standalone: false, // <--- QUITA O CAMBIA A false
  // imports: [ ... ], // <--- QUITA ESTE ARRAY COMPLETAMENTE
})
export class LevelDetailPage implements OnInit {
  levelId: number | null = null;

  constructor(private route: ActivatedRoute /* , tus otros servicios */) { }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.levelId = +idParam;
      console.log('Cargando detalles para el nivel ID:', this.levelId);
      // Aquí seguirás necesitando la lógica para cargar los datos del nivel
      // this.loadLevelDetails(this.levelId);
    } else {
      console.error('No se encontró ID de nivel en la ruta');
    }
  }

  // async loadLevelDetails(id: number) { /* ... tu lógica para cargar datos ... */ }
}