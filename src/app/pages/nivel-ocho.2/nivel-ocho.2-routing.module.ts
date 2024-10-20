import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelOcho2Page } from './nivel-ocho.2.page';

const routes: Routes = [
  {
    path: '',
    component: NivelOcho2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelOcho2PageRoutingModule {}
