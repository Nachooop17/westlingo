import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelSiete8Page } from './nivel-siete.8.page';

const routes: Routes = [
  {
    path: '',
    component: NivelSiete8Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelSiete8PageRoutingModule {}
