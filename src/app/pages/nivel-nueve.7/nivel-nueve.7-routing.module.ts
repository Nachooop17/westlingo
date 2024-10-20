import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelNueve7Page } from './nivel-nueve.7.page';

const routes: Routes = [
  {
    path: '',
    component: NivelNueve7Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelNueve7PageRoutingModule {}
