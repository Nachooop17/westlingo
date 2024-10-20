import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelSiete6Page } from './nivel-siete.6.page';

const routes: Routes = [
  {
    path: '',
    component: NivelSiete6Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelSiete6PageRoutingModule {}
