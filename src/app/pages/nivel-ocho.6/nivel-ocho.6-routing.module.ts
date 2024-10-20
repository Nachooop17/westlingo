import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelOcho6Page } from './nivel-ocho.6.page';

const routes: Routes = [
  {
    path: '',
    component: NivelOcho6Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelOcho6PageRoutingModule {}
