import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelNuevePage } from './nivel-nueve.page';

const routes: Routes = [
  {
    path: '',
    component: NivelNuevePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelNuevePageRoutingModule {}
