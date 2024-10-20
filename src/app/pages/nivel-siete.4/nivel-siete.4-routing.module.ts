import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelSiete4Page } from './nivel-siete.4.page';

const routes: Routes = [
  {
    path: '',
    component: NivelSiete4Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelSiete4PageRoutingModule {}
