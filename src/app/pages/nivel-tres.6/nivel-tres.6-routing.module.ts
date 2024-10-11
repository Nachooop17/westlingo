import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelTres6Page } from './nivel-tres.6.page';

const routes: Routes = [
  {
    path: '',
    component: NivelTres6Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelTres6PageRoutingModule {}
