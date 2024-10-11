import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelDos4Page } from './nivel-dos.4.page';

const routes: Routes = [
  {
    path: '',
    component: NivelDos4Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelDos4PageRoutingModule {}
