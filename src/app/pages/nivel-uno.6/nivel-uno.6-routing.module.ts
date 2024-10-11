import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelUno6Page } from './nivel-uno.6.page';

const routes: Routes = [
  {
    path: '',
    component: NivelUno6Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelUno6PageRoutingModule {}
