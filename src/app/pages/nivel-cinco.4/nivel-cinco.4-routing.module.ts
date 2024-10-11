import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelCinco4Page } from './nivel-cinco.4.page';

const routes: Routes = [
  {
    path: '',
    component: NivelCinco4Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelCinco4PageRoutingModule {}
