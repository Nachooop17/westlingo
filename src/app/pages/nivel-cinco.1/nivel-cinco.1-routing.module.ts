import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelCinco1Page } from './nivel-cinco.1.page';

const routes: Routes = [
  {
    path: '',
    component: NivelCinco1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelCinco1PageRoutingModule {}
