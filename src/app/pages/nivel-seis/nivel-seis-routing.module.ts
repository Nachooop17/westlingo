import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelSeisPage } from './nivel-seis.page';

const routes: Routes = [
  {
    path: '',
    component: NivelSeisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelSeisPageRoutingModule {}
