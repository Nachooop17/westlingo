import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelNueve5Page } from './nivel-nueve.5.page';

const routes: Routes = [
  {
    path: '',
    component: NivelNueve5Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelNueve5PageRoutingModule {}
