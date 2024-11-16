import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambionombrePage } from './cambionombre.page';

const routes: Routes = [
  {
    path: '',
    component: CambionombrePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CambionombrePageRoutingModule {}
