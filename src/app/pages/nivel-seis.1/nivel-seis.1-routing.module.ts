import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelSeis1Page } from './nivel-seis.1.page';

const routes: Routes = [
  {
    path: '',
    component: NivelSeis1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelSeis1PageRoutingModule {}
