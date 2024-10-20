import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelNueve6Page } from './nivel-nueve.6.page';

const routes: Routes = [
  {
    path: '',
    component: NivelNueve6Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelNueve6PageRoutingModule {}
