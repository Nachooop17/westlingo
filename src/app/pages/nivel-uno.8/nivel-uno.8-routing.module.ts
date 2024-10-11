import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelUno8Page } from './nivel-uno.8.page';

const routes: Routes = [
  {
    path: '',
    component: NivelUno8Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelUno8PageRoutingModule {}
