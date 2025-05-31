import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuizDosPage } from './quiz-dos.page';

const routes: Routes = [
  {
    path: '',
    component: QuizDosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizDosPageRoutingModule {}
