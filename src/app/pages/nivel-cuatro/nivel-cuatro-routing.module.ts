import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelCuatroPage } from './nivel-cuatro.page';

const routes: Routes = [
  {
    path: '',
    component: NivelCuatroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelCuatroPageRoutingModule {}
