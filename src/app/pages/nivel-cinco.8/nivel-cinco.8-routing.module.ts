import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelCinco8Page } from './nivel-cinco.8.page';

const routes: Routes = [
  {
    path: '',
    component: NivelCinco8Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelCinco8PageRoutingModule {}
