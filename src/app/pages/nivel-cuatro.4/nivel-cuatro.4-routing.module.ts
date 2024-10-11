import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelCuatro4Page } from './nivel-cuatro.4.page';

const routes: Routes = [
  {
    path: '',
    component: NivelCuatro4Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelCuatro4PageRoutingModule {}
