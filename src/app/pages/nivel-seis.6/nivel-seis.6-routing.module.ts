import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelSeis6Page } from './nivel-seis.6.page';

const routes: Routes = [
  {
    path: '',
    component: NivelSeis6Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelSeis6PageRoutingModule {}
