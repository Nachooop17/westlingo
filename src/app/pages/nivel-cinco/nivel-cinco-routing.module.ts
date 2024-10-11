import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelCincoPage } from './nivel-cinco.page';

const routes: Routes = [
  {
    path: '',
    component: NivelCincoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelCincoPageRoutingModule {}
