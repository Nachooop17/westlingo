import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelCuatro2Page } from './nivel-cuatro.2.page';

const routes: Routes = [
  {
    path: '',
    component: NivelCuatro2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelCuatro2PageRoutingModule {}
