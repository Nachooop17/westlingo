import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelOchoPage } from './nivel-ocho.page';

const routes: Routes = [
  {
    path: '',
    component: NivelOchoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelOchoPageRoutingModule {}
