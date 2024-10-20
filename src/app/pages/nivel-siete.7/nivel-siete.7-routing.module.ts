import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelSiete7Page } from './nivel-siete.7.page';

const routes: Routes = [
  {
    path: '',
    component: NivelSiete7Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelSiete7PageRoutingModule {}
