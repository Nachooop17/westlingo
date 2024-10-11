import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelTres5Page } from './nivel-tres.5.page';

const routes: Routes = [
  {
    path: '',
    component: NivelTres5Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelTres5PageRoutingModule {}
