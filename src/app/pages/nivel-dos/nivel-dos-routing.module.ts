import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelDosPage } from './nivel-dos.page';

const routes: Routes = [
  {
    path: '',
    component: NivelDosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelDosPageRoutingModule {}
