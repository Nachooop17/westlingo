import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelCuatro8Page } from './nivel-cuatro.8.page';

const routes: Routes = [
  {
    path: '',
    component: NivelCuatro8Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelCuatro8PageRoutingModule {}
