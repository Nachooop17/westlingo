import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelCinco2Page } from './nivel-cinco.2.page';

const routes: Routes = [
  {
    path: '',
    component: NivelCinco2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelCinco2PageRoutingModule {}
