import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuizSeisPage } from './quiz-seis.page';

const routes: Routes = [
  {
    path: '',
    component: QuizSeisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizSeisPageRoutingModule {}
