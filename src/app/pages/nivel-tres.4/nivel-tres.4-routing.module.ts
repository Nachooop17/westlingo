import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelTres4Page } from './nivel-tres.4.page';

const routes: Routes = [
  {
    path: '',
    component: NivelTres4Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelTres4PageRoutingModule {}
