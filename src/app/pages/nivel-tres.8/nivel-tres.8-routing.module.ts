import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelTres8Page } from './nivel-tres.8.page';

const routes: Routes = [
  {
    path: '',
    component: NivelTres8Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelTres8PageRoutingModule {}
