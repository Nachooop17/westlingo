import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelDos8Page } from './nivel-dos.8.page';

const routes: Routes = [
  {
    path: '',
    component: NivelDos8Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelDos8PageRoutingModule {}
