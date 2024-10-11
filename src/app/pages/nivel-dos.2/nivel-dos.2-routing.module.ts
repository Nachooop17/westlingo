import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelDos2Page } from './nivel-dos.2.page';

const routes: Routes = [
  {
    path: '',
    component: NivelDos2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelDos2PageRoutingModule {}
