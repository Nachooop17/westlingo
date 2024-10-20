import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelSietePage } from './nivel-siete.page';

const routes: Routes = [
  {
    path: '',
    component: NivelSietePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelSietePageRoutingModule {}
