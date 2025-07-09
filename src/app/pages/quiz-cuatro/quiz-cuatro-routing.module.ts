import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuizCuatroPage } from './quiz-cuatro.page';

const routes: Routes = [
  {
    path: '',
    component: QuizCuatroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizCuatroPageRoutingModule {}
