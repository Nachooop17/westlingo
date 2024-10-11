import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelUno7Page } from './nivel-uno.7.page';

const routes: Routes = [
  {
    path: '',
    component: NivelUno7Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelUno7PageRoutingModule {}
