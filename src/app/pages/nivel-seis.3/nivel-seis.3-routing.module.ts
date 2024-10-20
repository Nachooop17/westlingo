import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelSeis3Page } from './nivel-seis.3.page';

const routes: Routes = [
  {
    path: '',
    component: NivelSeis3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelSeis3PageRoutingModule {}
