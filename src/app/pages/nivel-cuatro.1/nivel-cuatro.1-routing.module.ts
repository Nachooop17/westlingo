import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelCuatro1Page } from './nivel-cuatro.1.page';

const routes: Routes = [
  {
    path: '',
    component: NivelCuatro1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelCuatro1PageRoutingModule {}
