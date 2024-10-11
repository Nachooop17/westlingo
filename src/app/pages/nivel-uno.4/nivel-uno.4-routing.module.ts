import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelUno4Page } from './nivel-uno.4.page';

const routes: Routes = [
  {
    path: '',
    component: NivelUno4Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelUno4PageRoutingModule {}
