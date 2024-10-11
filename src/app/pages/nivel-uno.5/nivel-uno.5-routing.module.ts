import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelUno5Page } from './nivel-uno.5.page';

const routes: Routes = [
  {
    path: '',
    component: NivelUno5Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelUno5PageRoutingModule {}
