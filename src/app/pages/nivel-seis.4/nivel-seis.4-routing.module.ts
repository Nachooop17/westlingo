import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelSeis4Page } from './nivel-seis.4.page';

const routes: Routes = [
  {
    path: '',
    component: NivelSeis4Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelSeis4PageRoutingModule {}
