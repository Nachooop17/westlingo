import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelNueve4Page } from './nivel-nueve.4.page';

const routes: Routes = [
  {
    path: '',
    component: NivelNueve4Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelNueve4PageRoutingModule {}
