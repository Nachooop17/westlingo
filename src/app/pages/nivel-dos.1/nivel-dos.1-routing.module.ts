import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelDos1Page } from './nivel-dos.1.page';

const routes: Routes = [
  {
    path: '',
    component: NivelDos1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelDos1PageRoutingModule {}
