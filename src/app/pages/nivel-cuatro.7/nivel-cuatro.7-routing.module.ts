import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelCuatro7Page } from './nivel-cuatro.7.page';

const routes: Routes = [
  {
    path: '',
    component: NivelCuatro7Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelCuatro7PageRoutingModule {}
