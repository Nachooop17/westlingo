import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelCinco6Page } from './nivel-cinco.6.page';

const routes: Routes = [
  {
    path: '',
    component: NivelCinco6Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelCinco6PageRoutingModule {}
