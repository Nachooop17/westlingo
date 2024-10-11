import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelDos3Page } from './nivel-dos.3.page';

const routes: Routes = [
  {
    path: '',
    component: NivelDos3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelDos3PageRoutingModule {}
