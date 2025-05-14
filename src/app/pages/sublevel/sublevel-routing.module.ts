import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SublevelPage } from './sublevel.page';

const routes: Routes = [
  {
    path: '',
    component: SublevelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SublevelPageRoutingModule {}
