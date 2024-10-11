import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelTres3Page } from './nivel-tres.3.page';

const routes: Routes = [
  {
    path: '',
    component: NivelTres3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelTres3PageRoutingModule {}
