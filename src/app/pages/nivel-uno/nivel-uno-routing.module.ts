import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelUnoPage } from './nivel-uno.page';

const routes: Routes = [
  {
    path: '',
    component: NivelUnoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelUnoPageRoutingModule {}
