import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelNueve1Page } from './nivel-nueve.1.page';

const routes: Routes = [
  {
    path: '',
    component: NivelNueve1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelNueve1PageRoutingModule {}
