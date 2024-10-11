import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelUno3Page } from './nivel-uno.3.page';

const routes: Routes = [
  {
    path: '',
    component: NivelUno3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelUno3PageRoutingModule {}
