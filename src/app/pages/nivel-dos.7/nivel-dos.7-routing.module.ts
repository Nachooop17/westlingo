import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelDos7Page } from './nivel-dos.7.page';

const routes: Routes = [
  {
    path: '',
    component: NivelDos7Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelDos7PageRoutingModule {}
