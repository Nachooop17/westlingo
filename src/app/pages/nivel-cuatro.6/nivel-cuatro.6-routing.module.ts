import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelCuatro6Page } from './nivel-cuatro.6.page';

const routes: Routes = [
  {
    path: '',
    component: NivelCuatro6Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelCuatro6PageRoutingModule {}
