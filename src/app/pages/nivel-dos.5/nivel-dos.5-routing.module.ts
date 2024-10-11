import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelDos5Page } from './nivel-dos.5.page';

const routes: Routes = [
  {
    path: '',
    component: NivelDos5Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelDos5PageRoutingModule {}
