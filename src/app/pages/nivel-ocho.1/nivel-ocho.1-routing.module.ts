import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelOcho1Page } from './nivel-ocho.1.page';

const routes: Routes = [
  {
    path: '',
    component: NivelOcho1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelOcho1PageRoutingModule {}
