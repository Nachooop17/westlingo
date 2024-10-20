import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelOcho5Page } from './nivel-ocho.5.page';

const routes: Routes = [
  {
    path: '',
    component: NivelOcho5Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelOcho5PageRoutingModule {}
