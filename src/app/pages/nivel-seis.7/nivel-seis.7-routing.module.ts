import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelSeis7Page } from './nivel-seis.7.page';

const routes: Routes = [
  {
    path: '',
    component: NivelSeis7Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelSeis7PageRoutingModule {}
