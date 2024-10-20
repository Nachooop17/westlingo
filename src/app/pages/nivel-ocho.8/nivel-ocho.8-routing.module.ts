import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelOcho8Page } from './nivel-ocho.8.page';

const routes: Routes = [
  {
    path: '',
    component: NivelOcho8Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelOcho8PageRoutingModule {}
