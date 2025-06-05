import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuizTresPage } from './quiz-tres.page';

const routes: Routes = [
  {
    path: '',
    component: QuizTresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizTresPageRoutingModule {}
