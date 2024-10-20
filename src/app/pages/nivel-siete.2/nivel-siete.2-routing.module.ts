import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelSiete2Page } from './nivel-siete.2.page';

const routes: Routes = [
  {
    path: '',
    component: NivelSiete2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelSiete2PageRoutingModule {}
