import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelOcho7Page } from './nivel-ocho.7.page';

const routes: Routes = [
  {
    path: '',
    component: NivelOcho7Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelOcho7PageRoutingModule {}
