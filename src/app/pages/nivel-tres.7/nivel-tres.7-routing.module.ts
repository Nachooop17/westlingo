import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelTres7Page } from './nivel-tres.7.page';

const routes: Routes = [
  {
    path: '',
    component: NivelTres7Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelTres7PageRoutingModule {}
