import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelOcho3Page } from './nivel-ocho.3.page';

const routes: Routes = [
  {
    path: '',
    component: NivelOcho3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelOcho3PageRoutingModule {}
