import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelSiete3Page } from './nivel-siete.3.page';

const routes: Routes = [
  {
    path: '',
    component: NivelSiete3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelSiete3PageRoutingModule {}
