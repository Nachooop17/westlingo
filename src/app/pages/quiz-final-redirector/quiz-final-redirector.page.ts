import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-quiz-final-redirector',
  templateUrl: './quiz-final-redirector.page.html',
  styleUrls: ['./quiz-final-redirector.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class QuizFinalRedirectorPage implements OnInit {

  levelId: string | null = null;
  subnivelId: string | null = null;

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
      this.router.navigate(['/tabs/niveles']);
    }
  }

  private redirectToRandomQuiz() {
  let quizRoutes: string[];

  // Imprime el valor real para depuración
  console.log('Valor de levelId:', this.levelId);

  // Asegúrate de comparar el valor limpio
  if (this.levelId && this.levelId.trim() === '3') {
    quizRoutes = [
      '/quiz-cuatro',
      '/quiz-cinco',
      '/quiz-seis'
    ];
  } else {
    quizRoutes = [
      '/quiz-uno',
      '/quiz-dos',
      '/quiz-tres'
    ];
  }

  if (!quizRoutes || quizRoutes.length === 0) {
    console.error('QuizFinalRedirectorPage: No hay rutas de quiz de destino configuradas.');
    this.router.navigate(['/tabs/niveles']);
    return;
  }

  const randomIndex = Math.floor(Math.random() * quizRoutes.length);
  const selectedQuizBaseRoute = quizRoutes[randomIndex];

  const navigationExtras = {
    replaceUrl: true
  };

  console.log(`QuizFinalRedirectorPage: Redirigiendo a: ${selectedQuizBaseRoute}/${this.levelId}/${this.subnivelId}`);
  this.router.navigate([selectedQuizBaseRoute, this.levelId, this.subnivelId], navigationExtras);
}
}