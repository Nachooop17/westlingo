import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelSeis2Page } from './nivel-seis.2.page';

const routes: Routes = [
  {
    path: '',
    component: NivelSeis2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelSeis2PageRoutingModule {}
