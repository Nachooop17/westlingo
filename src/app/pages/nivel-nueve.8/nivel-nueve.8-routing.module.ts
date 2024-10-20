import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelNueve8Page } from './nivel-nueve.8.page';

const routes: Routes = [
  {
    path: '',
    component: NivelNueve8Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelNueve8PageRoutingModule {}
