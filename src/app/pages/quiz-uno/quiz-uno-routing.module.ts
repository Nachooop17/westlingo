import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuizUnoPage } from './quiz-uno.page';

const routes: Routes = [
  {
    path: '',
    component: QuizUnoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizUnoPageRoutingModule {}
