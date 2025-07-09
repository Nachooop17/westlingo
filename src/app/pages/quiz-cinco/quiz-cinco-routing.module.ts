import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuizCincoPage } from './quiz-cinco.page';

const routes: Routes = [
  {
    path: '',
    component: QuizCincoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizCincoPageRoutingModule {}
