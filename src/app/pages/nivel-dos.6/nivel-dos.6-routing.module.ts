import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelDos6Page } from './nivel-dos.6.page';

const routes: Routes = [
  {
    path: '',
    component: NivelDos6Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelDos6PageRoutingModule {}
