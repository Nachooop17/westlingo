import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelCuatro3Page } from './nivel-cuatro.3.page';

const routes: Routes = [
  {
    path: '',
    component: NivelCuatro3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelCuatro3PageRoutingModule {}
