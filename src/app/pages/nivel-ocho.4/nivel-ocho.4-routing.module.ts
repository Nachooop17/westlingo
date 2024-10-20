import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelOcho4Page } from './nivel-ocho.4.page';

const routes: Routes = [
  {
    path: '',
    component: NivelOcho4Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelOcho4PageRoutingModule {}
