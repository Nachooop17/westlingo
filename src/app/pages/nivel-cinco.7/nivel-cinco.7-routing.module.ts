import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelCinco7Page } from './nivel-cinco.7.page';

const routes: Routes = [
  {
    path: '',
    component: NivelCinco7Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelCinco7PageRoutingModule {}
