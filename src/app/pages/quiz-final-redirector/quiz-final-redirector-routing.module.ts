import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizFinalRedirectorPage } from './quiz-final-redirector.page';

const routes: Routes = [
  {
    path: '', // La ruta base ya está definida en app-routing.module.ts
    component: QuizFinalRedirectorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuizFinalRedirectorPageRoutingModule {}