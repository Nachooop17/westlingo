import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelTresPage } from './nivel-tres.page';

const routes: Routes = [
  {
    path: '',
    component: NivelTresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelTresPageRoutingModule {}
