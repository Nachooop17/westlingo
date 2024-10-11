import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelUno2Page } from './nivel-uno.2.page';

const routes: Routes = [
  {
    path: '',
    component: NivelUno2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelUno2PageRoutingModule {}
