import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelCuatro5Page } from './nivel-cuatro.5.page';

const routes: Routes = [
  {
    path: '',
    component: NivelCuatro5Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelCuatro5PageRoutingModule {}
