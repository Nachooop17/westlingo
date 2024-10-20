import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelNueve2Page } from './nivel-nueve.2.page';

const routes: Routes = [
  {
    path: '',
    component: NivelNueve2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelNueve2PageRoutingModule {}
