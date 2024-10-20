import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelSeis5Page } from './nivel-seis.5.page';

const routes: Routes = [
  {
    path: '',
    component: NivelSeis5Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelSeis5PageRoutingModule {}
