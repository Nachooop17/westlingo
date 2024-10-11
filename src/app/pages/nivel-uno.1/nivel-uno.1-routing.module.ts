import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelUno1Page } from './nivel-uno.1.page';

const routes: Routes = [
  {
    path: '',
    component: NivelUno1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelUno1PageRoutingModule {}
