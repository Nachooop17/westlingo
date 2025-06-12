import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // RouterModule para el template si fuera necesario
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'; // Para componentes Ionic como ion-spinner

@Component({
  selector: 'app-quiz-final-redirector',
  templateUrl: './quiz-final-redirector.page.html', // Asegúrate que este archivo exista
  styleUrls: ['./quiz-final-redirector.page.scss'],  // Asegúrate que este archivo exista
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class QuizFinalRedirectorPage implements OnInit {

  levelId: string | null = null;
  subnivelId: string | null = null; // Este es el ID del subnivel "Quiz Final"

  // Define las rutas base de tus páginas de quiz individuales
  // Asegúrate que estas rutas existan y lleven a los componentes de quiz correctos.
  private targetQuizRoutes: string[] = [
    '/quiz-uno',  // Ruta para QuizUnoPage
    '/quiz-dos',  // Ruta para QuizDosPage
    '/quiz-tres'  // Ruta para QuizTresPage
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.levelId = this.route.snapshot.paramMap.get('levelId');
    this.subnivelId = this.route.snapshot.paramMap.get('subnivelId');

    if (this.levelId && this.subnivelId) {
      this.redirectToRandomQuiz();
    } else {
      console.error('QuizFinalRedirectorPage: Faltan levelId o subnivelId. No se puede redirigir.');
      // Considera redirigir a una página de error o de vuelta a la lista de niveles
      // Ajusta '/tabs/niveles' si tu ruta principal para la lista de niveles es diferente.
      this.router.navigate(['/tabs/niveles']);
    }
  }

  private redirectToRandomQuiz() {
    if (!this.targetQuizRoutes || this.targetQuizRoutes.length === 0) {
      console.error('QuizFinalRedirectorPage: No hay rutas de quiz de destino configuradas.');
      this.router.navigate(['/tabs/niveles']); // Ajusta la ruta de fallback
      return;
    }

    const randomIndex = Math.floor(Math.random() * this.targetQuizRoutes.length);
    const selectedQuizBaseRoute = this.targetQuizRoutes[randomIndex];

    // Opciones de navegación: replaceUrl: true evita que esta página de redirección
    // quede en el historial del navegador.
    const navigationExtras = {
      replaceUrl: true
      // Puedes pasar datos adicionales si es necesario, aunque los parámetros de ruta son lo principal
      // state: { redirectSource: 'quiz-final-redirector' }
    };

    console.log(`QuizFinalRedirectorPage: Redirigiendo a: ${selectedQuizBaseRoute}/${this.levelId}/${this.subnivelId}`);
    // Navega a la ruta del quiz seleccionado, pasando el levelId y subnivelId originales.
    this.router.navigate([selectedQuizBaseRoute, this.levelId, this.subnivelId], navigationExtras);
  }
}