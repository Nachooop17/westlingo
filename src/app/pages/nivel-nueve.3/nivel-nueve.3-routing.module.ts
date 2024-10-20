import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelNueve3Page } from './nivel-nueve.3.page';

const routes: Routes = [
  {
    path: '',
    component: NivelNueve3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelNueve3PageRoutingModule {}
