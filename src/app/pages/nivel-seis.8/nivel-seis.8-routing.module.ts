import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelSeis8Page } from './nivel-seis.8.page';

const routes: Routes = [
  {
    path: '',
    component: NivelSeis8Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelSeis8PageRoutingModule {}
