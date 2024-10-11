import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelTres1Page } from './nivel-tres.1.page';

const routes: Routes = [
  {
    path: '',
    component: NivelTres1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelTres1PageRoutingModule {}
