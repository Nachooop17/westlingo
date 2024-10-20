import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NivelSiete5Page } from './nivel-siete.5.page';

const routes: Routes = [
  {
    path: '',
    component: NivelSiete5Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NivelSiete5PageRoutingModule {}
