import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelTres2Page } from './nivel-tres.2.page';

const routes: Routes = [
  {
    path: '',
    component: NivelTres2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelTres2PageRoutingModule {}
