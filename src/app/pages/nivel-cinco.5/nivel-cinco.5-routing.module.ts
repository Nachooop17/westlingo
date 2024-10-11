import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelCinco5Page } from './nivel-cinco.5.page';

const routes: Routes = [
  {
    path: '',
    component: NivelCinco5Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelCinco5PageRoutingModule {}
