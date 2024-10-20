import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelSiete1Page } from './nivel-siete.1.page';

const routes: Routes = [
  {
    path: '',
    component: NivelSiete1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelSiete1PageRoutingModule {}
